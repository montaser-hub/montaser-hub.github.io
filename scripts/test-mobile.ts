/**
 * Checks the built site the way a phone sees it: a 390x844 touch screen in
 * headless Chrome, driven over the DevTools protocol. It fails when
 *
 *   - the page logs an error or throws,
 *   - the page scrolls sideways,
 *   - a tab bar button does not land on its section and mark it current,
 *   - any screen, scrolling top to bottom, shows no content,
 *   - with JavaScript off, content stays hidden.
 *
 *   npm run test:mobile   (builds first; needs Google Chrome or Chromium)
 */
import { spawn, execSync } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { sections } from "../lib/sections.ts";

const OUT = path.resolve(import.meta.dirname, "..", "out");
const PORT = 4593;
const DEBUG_PORT = 9334;
const SCREEN = { width: 390, height: 844 };
const TAB_BAR = 64;

const TYPES: Record<string, string> = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const failures: string[] = [];
const check = (ok: boolean, message: string) => {
  console.log(`${ok ? "  ok  " : "  FAIL"} ${message}`);
  if (!ok) failures.push(message);
};

// A static server for out/, as GitHub Pages serves it.
const server = createServer((request, response) => {
  const url = decodeURIComponent((request.url ?? "/").split("?")[0]);
  let file = path.join(OUT, url);
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  if (!file.startsWith(OUT) || !existsSync(file)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
});
await new Promise<void>((resolve) => server.listen(PORT, resolve));

const chromePath = ["google-chrome", "chromium", "chromium-browser"]
  .map((name) => { try { return execSync(`command -v ${name}`).toString().trim(); } catch { return ""; } })
  .find(Boolean);
if (!chromePath) throw new Error("Needs Google Chrome or Chromium on the PATH.");
const chrome = spawn(chromePath, ["--headless=new", "--no-sandbox", "--hide-scrollbars", `--remote-debugging-port=${DEBUG_PORT}`, "about:blank"], { stdio: "ignore" });

/** Opens a fresh tab and returns helpers to drive it. */
async function openPage(options: { javascript: boolean }) {
  let targets: { type: string; webSocketDebuggerUrl: string }[] = [];
  for (let tries = 0; !targets.length; tries++) {
    try {
      targets = (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)).json()).filter((t: { type: string }) => t.type === "page");
    } catch (error) {
      if (tries > 40) throw error;
      await sleep(250);
    }
  }
  const socket = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((resolve) => (socket.onopen = resolve));

  let id = 0;
  const pending = new Map<number, (result: { result: { value: never } }) => void>();
  const errors: string[] = [];
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(String(data));
    if (message.id) pending.get(message.id)?.(message.result);
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description ?? "exception");
    if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
      errors.push(message.params.args.map((arg: { value?: string; description?: string }) => arg.value ?? arg.description).join(" "));
    }
  };
  const send = (method: string, params = {}) =>
    new Promise<{ result: { value: never } }>((resolve) => {
      pending.set(++id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async <T>(expression: string): Promise<T> =>
    (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;

  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { ...SCREEN, deviceScaleFactor: 2, mobile: true });
  await send("Emulation.setTouchEmulationEnabled", { enabled: true });
  await send("Emulation.setScriptExecutionDisabled", { value: !options.javascript });
  await send("Page.navigate", { url: `http://localhost:${PORT}/` });
  await sleep(4000);
  // Smooth scrolling takes a moment: wait until the page stops moving.
  const settle = async () => {
    let last = -1;
    for (let tries = 0; tries < 40; tries++) {
      const y = await evaluate<number>("scrollY");
      if (y === last) return;
      last = y;
      await sleep(150);
    }
  };
  return { evaluate, settle, errors, close: () => socket.close() };
}

/** In-page: how many text blocks are on screen (above the tab bar) and not faded out. */
const VISIBLE_TEXT = `[...document.querySelectorAll("main h2, main h3, main p, main li")].filter((element) => {
  const box = element.getBoundingClientRect();
  if (!box.height || box.bottom < 0 || box.top > innerHeight - ${TAB_BAR}) return false;
  for (let node = element; node && node !== document.body; node = node.parentElement) {
    if (Number(getComputedStyle(node).opacity) < 0.5) return false;
  }
  return true;
}).length`;

try {
  console.log("With JavaScript");
  const page = await openPage({ javascript: true });

  check(!(await page.evaluate<boolean>("document.documentElement.scrollWidth > innerWidth")), "no sideways scrolling");

  for (const { id, label } of sections) {
    await page.evaluate(`document.querySelector('.mobile-nav a[href="#${id}"]').click()`);
    await sleep(200);
    await page.settle();
    // "|| 0" turns -0 into 0, which the protocol can return as a plain number.
    const top = await page.evaluate<number>(`Math.round(document.getElementById("${id}").getBoundingClientRect().top) || 0`);
    const current = await page.evaluate<string | null>(`document.querySelector(".mobile-nav [aria-current]")?.getAttribute("href") ?? null`);
    check(Math.abs(top) <= 2 || (id === sections.at(-1)?.id && top < SCREEN.height), `${label} button scrolls to its section (top at ${top}px)`);
    check(current === `#${id}`, `${label} button is marked current (got ${current})`);
  }

  const height = await page.evaluate<number>("document.documentElement.scrollHeight");
  const empty: number[] = [];
  for (let y = 0; y < height; y += SCREEN.height / 2) {
    await page.evaluate(`window.scrollTo({ top: ${y}, behavior: "instant" })`);
    await sleep(350);
    if (!(await page.evaluate<number>(VISIBLE_TEXT))) empty.push(y);
  }
  check(!empty.length, `every screen shows content${empty.length ? ` (empty at ${empty.join(", ")}px)` : ""}`);
  check(!page.errors.length, `no console errors${page.errors.length ? `: ${page.errors.join(" | ")}` : ""}`);
  page.close();

  console.log("Without JavaScript");
  const plain = await openPage({ javascript: false });
  check((await plain.evaluate<number>(VISIBLE_TEXT)) > 0, "first screen shows content");
  plain.close();
} finally {
  chrome.kill();
  server.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll mobile checks passed.");
