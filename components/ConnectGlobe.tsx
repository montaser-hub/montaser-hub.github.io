"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import createGlobe from "cobe";
import { places, regions } from "@/lib/data";

const TILT = 0.3; // radians the globe leans toward the viewer
const SWAY = 0.45; // radians it turns to either side of the first place
const SPEED = 0.004; // sway progress per frame
const MARKER_SIZE = 0.04;
const GLOBE_RADIUS = 0.4; // of the canvas width
const DRAG_TURN = 2.2; // radians turned by dragging across the whole canvas
const MAX_TILT = 1.1; // how far it can be tipped up or down, in radians
const RETURN = 0.965; // share of a dragged turn kept each frame once released
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

/** The rotation that brings a longitude to the front of the globe. */
const facing = (longitude: number) => (3 * Math.PI) / 2 - (longitude * Math.PI) / 180;

/** Places an element on a marker through the anchor cobe exposes for it. */
const anchored = (id: string) => ({ positionAnchor: `--cobe-${id}` }) as CSSProperties;

/**
 * Which way the surface faces at a place, for a globe turned by `phi` and
 * tipped by `theta`: x to the right, y up, z toward the viewer (1 = dead
 * centre, 0 = on the edge, negative = far side). Same convention as cobe.
 */
function surfaceNormal([latitude, longitude]: [number, number], phi: number, theta: number) {
  const lat = (latitude * Math.PI) / 180;
  const lng = (longitude * Math.PI) / 180 - Math.PI;
  const point = [-Math.cos(lat) * Math.cos(lng), Math.sin(lat), Math.cos(lat) * Math.sin(lng)];
  const across = Math.cos(phi) * point[0] + Math.sin(phi) * point[2];
  const depth = -Math.sin(phi) * point[0] + Math.cos(phi) * point[2];
  return {
    x: across,
    y: Math.cos(theta) * point[1] - Math.sin(theta) * depth,
    z: Math.sin(theta) * point[1] + Math.cos(theta) * depth,
  };
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5 text-accent">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/**
 * The hero globe. It pins the places and writes the region names listed in
 * lib/data.ts, and sways around the first place so that pin stays in view.
 * It can be dragged round and tipped up or down; once released it drifts back
 * to that view. Region names lie on the surface: they turn and narrow with it.
 * Labels are styled as `.globe-pin` and `.globe-region` in globals.css.
 */
export default function ConnectGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const regionRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Hidden below the md breakpoint: don't create a WebGL context nobody sees.
    if (!canvas || canvas.offsetWidth === 0) return;

    const centre = facing(places[0]?.location[1] ?? 0);
    let progress = 0; // position in the sway
    let turned = 0; // extra rotation from dragging sideways
    let tipped = 0; // extra tilt from dragging up or down
    let dragFrom: { x: number; y: number } | undefined; // pointer position at the last drag event
    let width = canvas.offsetWidth;
    let frame = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: centre,
      theta: TILT,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.15, 0.17, 0.2],
      markerColor: [0.96, 0.51, 0.12],
      glowColor: [0.55, 0.32, 0.1],
      // Flat on the surface: cobe counts a raised marker past the edge of the disc as visible.
      markerElevation: 0,
      markers: [
        ...places.map(({ id, location }) => ({ id, location, size: MARKER_SIZE })),
        // Regions only need an anchor for their name, not a dot.
        ...regions.map(({ id, location }) => ({ id, location, size: 0 })),
      ],
    });

    const draw = () => {
      const phi = centre + Math.sin(progress) * SWAY + turned;
      const theta = TILT + tipped;
      globe.update({ phi, theta, width: width * 2, height: width * 2 });

      // Lay each region name on the surface: facing the way the surface does, fading toward the edge.
      regions.forEach(({ location }, i) => {
        const label = regionRefs.current[i];
        if (!label) return;
        const normal = surfaceNormal(location, phi, theta);
        label.style.opacity = String(Math.max(0, Math.min(1, normal.z * 2.5)));
        label.style.transform = `rotateY(${Math.atan2(normal.x, normal.z).toFixed(3)}rad) rotateX(${Math.asin(clamp(normal.y, 1)).toFixed(3)}rad)`;
      });
    };
    const animate = () => {
      if (!dragFrom) {
        progress += SPEED;
        turned *= RETURN;
        tipped *= RETURN;
      }
      draw();
      frame = requestAnimationFrame(animate);
    };

    // Move only while the globe is on screen, and not at all for users who
    // prefer reduced motion: WebGL redraws every frame otherwise, for nothing.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => {
      if (!frame && !reduceMotion) frame = requestAnimationFrame(animate);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Dragging: only the disc itself responds, not the corners of the square canvas.
    const onGlobe = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      const radius = box.width * GLOBE_RADIUS;
      return Math.hypot(event.clientX - box.left - box.width / 2, event.clientY - box.top - box.height / 2) <= radius;
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!onGlobe(event)) return;
      dragFrom = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragFrom) {
        canvas.style.cursor = onGlobe(event) ? "grab" : "";
        return;
      }
      turned += ((event.clientX - dragFrom.x) / width) * DRAG_TURN;
      // A finger moving up or down is scrolling the page, so only a mouse or pen tips the globe.
      if (event.pointerType !== "touch") {
        tipped = clamp(TILT + tipped + ((event.clientY - dragFrom.y) / width) * DRAG_TURN, MAX_TILT) - TILT;
      }
      dragFrom = { x: event.clientX, y: event.clientY };
      if (!frame) draw(); // the animation loop redraws on its own when running
    };
    const onPointerUp = (event: PointerEvent) => {
      dragFrom = undefined;
      canvas.style.cursor = onGlobe(event) ? "grab" : "";
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    const onResize = () => {
      width = canvas.offsetWidth;
      if (!frame) draw();
    };
    window.addEventListener("resize", onResize);

    draw();
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    observer.observe(canvas);

    return () => {
      stop();
      observer.disconnect();
      globe.destroy();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute top-1/2 -right-[38%] hidden aspect-square w-[42rem] max-w-none -translate-y-1/2 opacity-90 sm:-right-[28%] md:block xl:-right-[14%] xl:w-[46rem] 2xl:-right-[4%] 2xl:w-[50rem]">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-auto"
        // pan-y: a vertical swipe on the globe still scrolls the page.
        style={{ width: "100%", height: "100%", contain: "layout paint size", touchAction: "pan-y" }}
      />
      {regions.map(({ id, label }, i) => (
        <span
          key={id}
          ref={(element) => {
            regionRefs.current[i] = element;
          }}
          aria-hidden="true"
          className="globe-region"
          style={anchored(id)}
        >
          {label}
        </span>
      ))}
      {places.map(({ id, label }) => (
        // cobe defines the variable only while the pin is on the near side.
        <p key={id} className="globe-pin" style={{ ...anchored(id), opacity: `var(--cobe-visible-${id}, 0)` }}>
          <PinIcon />
          {label}
        </p>
      ))}
    </div>
  );
}
