"use client";

import { useSyncExternalStore } from "react";
import { sections, type SectionId } from "@/lib/sections";

/*
 * One tracker for the whole page, shared by every menu that asks: a single
 * scroll listener runs while at least one component is subscribed.
 */
let active: SectionId | undefined;
const listeners = new Set<() => void>();
let frame = 0;

/** The last section whose top has passed a line 40% down the viewport. */
function measure() {
  frame = 0;
  const line = window.innerHeight * 0.4;
  const elements = sections
    .map(({ id }) => document.getElementById(id))
    .filter((element): element is HTMLElement => element !== null);
  // At the very bottom the last section may be too short to reach the line.
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const current = atBottom
    ? elements[elements.length - 1]
    : elements.filter((element) => element.getBoundingClientRect().top <= line).pop();
  const next = current?.id as SectionId | undefined;
  if (next === active) return;
  active = next;
  listeners.forEach((notify) => notify());
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(measure);
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  if (listeners.size === 1) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
  }
  return () => {
    listeners.delete(notify);
    if (listeners.size > 0) return;
    cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}

/**
 * The section currently being read, or undefined above the first section
 * (the hero) and while rendering on the server.
 */
export function useActiveSection(): SectionId | undefined {
  return useSyncExternalStore(subscribe, () => active, () => undefined);
}
