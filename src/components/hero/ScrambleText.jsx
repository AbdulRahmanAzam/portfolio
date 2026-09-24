"use client";

import { useEffect, useState } from "react";

const CHARS = "!<>-_\\/[]{}—=+*^?#_abcdefghijklmnopqrstuvwxyz";

// Renders the real text on the server (so crawlers and phones see it at once),
// then plays a decode effect on desktop only.
export function ScrambleText({ text, speed = 25, delay = 800 }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || window.innerWidth < 1024) return;

    let interval;
    const timeout = setTimeout(() => {
      let frame = 0;
      interval = setInterval(() => {
        let out = "";
        for (let i = 0; i < text.length; i++) {
          out += i < frame ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        setDisplay(out);
        frame++;
        if (frame > text.length + 2) {
          setDisplay(text);
          clearInterval(interval);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, speed, delay]);

  // Screen readers always get the real title, never the scrambled frames.
  return (
    <>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{text}</span>
    </>
  );
}
