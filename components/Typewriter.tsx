"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const TYPE_MS = 45;
const DELETE_MS = 22;
const HOLD_MS = 2200;

/**
 * Types each phrase, holds it, deletes it and moves to the next, forever.
 * Screen readers get the first phrase as plain text. For visitors who prefer
 * reduced motion the first phrase simply stays (same markup, so the server
 * and client render identically) and the caret stops blinking via CSS.
 */
export default function Typewriter({ phrases }: { phrases: readonly string[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  // Start fully typed so the server-rendered page shows the complete headline.
  const [length, setLength] = useState(phrases[0].length);
  const [deleting, setDeleting] = useState(false);

  const phrase = phrases[index];

  useEffect(() => {
    if (reduceMotion || phrases.length < 2) return;

    const atEnd = !deleting && length === phrase.length;
    const atStart = deleting && length === 0;
    const timer = setTimeout(
      () => {
        if (atEnd) setDeleting(true);
        else if (atStart) {
          setDeleting(false);
          setIndex((index + 1) % phrases.length);
        } else setLength(length + (deleting ? -1 : 1));
      },
      atEnd ? HOLD_MS : deleting ? DELETE_MS : TYPE_MS
    );
    return () => clearTimeout(timer);
  }, [deleting, index, length, phrase, phrases.length, reduceMotion]);

  return (
    <>
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden="true">
        {phrase.slice(0, length)}
        <span className="typewriter-caret" />
      </span>
    </>
  );
}
