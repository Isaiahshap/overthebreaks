"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, input, select, textarea, label, h1, [role='button']";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      if (el.closest(INTERACTIVE)) {
        cursorRef.current?.style.setProperty("--cursor-scale", "1.9");
      } else {
        cursorRef.current?.style.setProperty("--cursor-scale", "1");
      }
    };

    const loop = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%) scale(var(--cursor-scale, 1))`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        transition: "transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14 3 C7 2.5, 2 7.5, 2.5 14 C3 21 8 25.5 14 25 C21 24.5 26 19 25.5 13 C25 6.5 20 3 14 3 Z"
          stroke="#1a1a1a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="14" cy="14" r="2.5" fill="#ef3b2d" />
      </svg>
    </div>
  );
}
