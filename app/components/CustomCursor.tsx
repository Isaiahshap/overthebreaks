"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = "a, button, input, select, textarea, label, h1, [role='button'], [role='dialog']";
const DOT_RED = "#ef3b2d";
const DOT_BLUE = "#8fa4e8";
const PAPER = { r: 245, g: 240, b: 232 };
const INK = "#1a1a1a";
const PAPER_HEX = "#f5f0e8";

function luminance(rgb: { r: number; g: number; b: number }): number {
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
}

function isDarkBackground(rgb: { r: number; g: number; b: number }): boolean {
  return luminance(rgb) < 140;
}

function parseRgb(color: string): { r: number; g: number; b: number; a: number } | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return null;
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] !== undefined ? Number(match[4]) : 1,
  };
}

function isRedDotBackground(rgb: { r: number; g: number; b: number }): boolean {
  const { r, g, b } = rgb;
  const min = Math.min(r, g, b);
  const spread = Math.max(r, g, b) - min;
  // White, cream paper, and other light neutral site backgrounds
  return min >= 228 && spread <= 20;
}

function getBackgroundAtPoint(x: number, y: number): { r: number; g: number; b: number } {
  let el = document.elementFromPoint(x, y);

  while (el) {
    if (el.classList.contains("custom-cursor")) {
      el = el.parentElement;
      continue;
    }

    if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement || el instanceof HTMLCanvasElement) {
      return { r: 100, g: 100, b: 100 };
    }

    const parsed = parseRgb(getComputedStyle(el).backgroundColor);
    if (parsed && parsed.a > 0.1) {
      return { r: parsed.r, g: parsed.g, b: parsed.b };
    }

    el = el.parentElement;
  }

  return PAPER;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const dotColorRef = useRef(DOT_RED);
  const strokeColorRef = useRef(INK);
  const [visible, setVisible] = useState(false);
  const [dotColor, setDotColor] = useState(DOT_RED);
  const [strokeColor, setStrokeColor] = useState(INK);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    setVisible(true);

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };

      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el?.closest(INTERACTIVE)) {
        cursorRef.current?.style.setProperty("--cursor-scale", "1.9");
      } else {
        cursorRef.current?.style.setProperty("--cursor-scale", "1");
      }

      const bg = getBackgroundAtPoint(e.clientX, e.clientY);
      const onDark = isDarkBackground(bg);
      const nextDotColor = onDark ? DOT_RED : isRedDotBackground(bg) ? DOT_RED : DOT_BLUE;
      const nextStrokeColor = onDark ? PAPER_HEX : INK;

      if (nextDotColor !== dotColorRef.current) {
        dotColorRef.current = nextDotColor;
        setDotColor(nextDotColor);
      }
      if (nextStrokeColor !== strokeColorRef.current) {
        strokeColorRef.current = nextStrokeColor;
        setStrokeColor(nextStrokeColor);
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
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 10001,
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
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ transition: "stroke 0.15s ease" }}
        />
        <circle
          cx="14"
          cy="14"
          r="2.5"
          fill={dotColor}
          style={{ transition: "fill 0.15s ease" }}
        />
      </svg>
    </div>
  );
}
