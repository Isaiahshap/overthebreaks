"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import MusicPlayer from "./components/MusicPlayer";

const CustomCursor = dynamic(() => import("./components/CustomCursor"), {
  ssr: false,
});

const LoadingScreen = dynamic(() => import("./components/LoadingScreen"), {
  ssr: false,
});

const POSTER_COLORS = ["#ef3b2d", "#f26aa5", "#f5c400", "#006b55", "#8fa4e8"] as const;

function PosterFrame({ children, rotate }: { children: React.ReactNode; rotate: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? `rotate(0deg) scale(1.03)` : `rotate(${rotate})`,
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        willChange: "transform",
      }}
      className="relative"
    >
      <div
        style={{
          position: "absolute",
          inset: "-6px",
          border: "3px solid #1a1a1a",
          boxShadow: "4px 4px 0 0 #1a1a1a, -2px -1px 0 0 #1a1a1a, 5px 2px 0 0 #1a1a1a",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      {children}
    </div>
  );
}

export default function Page() {
  // Reveal: clip-path grows from center outward
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 700);
    return () => clearTimeout(t);
  }, []);

  const [titleColor, setTitleColor] = useState<string>("#1a1a1a");
  const nextColorIndexRef = useRef(0);

  const handleTitleEnter = useCallback(() => {
    setTitleColor(POSTER_COLORS[nextColorIndexRef.current]);
    nextColorIndexRef.current = (nextColorIndexRef.current + 1) % POSTER_COLORS.length;
  }, []);

  const handleTitleLeave = useCallback(() => {
    setTitleColor("#1a1a1a");
  }, []);

  return (
    <>
      <LoadingScreen />
      <CustomCursor />

      {/* Site content — grows from center via clip-path, sits above loading overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          clipPath: revealed ? "circle(200vmax at 50vw 50vh)" : "circle(0vmax at 50vw 50vh)",
          transition: revealed ? "clip-path 2.4s ease-in-out" : "none",
          willChange: "clip-path",
        }}
      >

      <main
        style={{ backgroundColor: "var(--paper)" }}
        className="otb-static min-h-screen w-full flex flex-col items-center px-6 py-16 md:py-24"
      >
        {/* ── Title ── */}
        <header className="w-full text-center mb-12 md:mb-16">
          {/*
            Wrap in a flex container so the hover zone is only the text width,
            not the full header width.
          */}
          <div className="flex justify-center">
            <h1
              className="font-title uppercase leading-none select-none"
              onMouseEnter={handleTitleEnter}
              onMouseLeave={handleTitleLeave}
              style={{
                fontSize: "clamp(3.5rem, 14vw, 11rem)",
                letterSpacing: "-0.01em",
                color: titleColor,
                transition: "color 0.25s ease",
                lineHeight: 0.93,
                display: "inline-block",
                width: "fit-content",
              }}
            >
              OVER
              <br />
              THE
              <br />
              BREAKS
            </h1>
          </div>
        </header>

        {/* ── Posters ── */}
        <section
          className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 mb-16 md:mb-20"
          aria-label="Event posters"
        >
          <PosterFrame rotate="-1.8deg">
            <div
              style={{
                width: "clamp(260px, 36vw, 420px)",
                aspectRatio: "616/767",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#d4cfc5",
              }}
            >
              <Image
                src="/posters/poster1.webp"
                alt="Over the Breaks — Poster 1"
                fill
                style={{ objectFit: "cover", objectPosition: "left center" }}
                priority
              />
            </div>
          </PosterFrame>

          <PosterFrame rotate="1.5deg">
            <div
              style={{
                width: "clamp(260px, 36vw, 420px)",
                aspectRatio: "616/767",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "#c9c2b8",
              }}
            >
              <Image
                src="/posters/poster2.webp"
                alt="Over the Breaks — Poster 2"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </PosterFrame>
        </section>

        {/* ── Info + Player ── */}
        <section
          className="w-full"
          style={{ maxWidth: 860 }}
          aria-label="Event details and music"
        >
          {/* Two columns — always side by side, even on mobile */}
          <div
            style={{
              display: "flex",
              flexWrap: "nowrap",
              gap: "clamp(0.75rem, 2.5vw, 2rem)",
              alignItems: "stretch",
            }}
          >
            {/* Info box */}
            <div
              style={{
                flex: "1 1 0",
                minWidth: 0,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  border: "2.5px solid #1a1a1a",
                  boxShadow: "5px 5px 0 0 #1a1a1a, -1px -1px 0 0 #1a1a1a",
                  padding: "clamp(1rem, 3vw, 2rem) clamp(0.75rem, 3vw, 2.5rem)",
                  backgroundColor: "var(--paper)",
                  height: "100%",
                }}
              >
                <ul className="list-none p-0 m-0 space-y-1.5">
                  {[
                    "2 Nights at The Lodge Room",
                    "September 18 + 19",
                    "Highland Park, Los Angeles",
                  ].map((line) => (
                    <li
                      key={line}
                      className="font-title uppercase"
                      style={{
                        fontSize: "clamp(0.8rem, 3.5vw, 1.75rem)",
                        letterSpacing: "0.05em",
                        color: "#1a1a1a",
                        lineHeight: 1.3,
                      }}
                    >
                      {line}
                    </li>
                  ))}
                </ul>

                <p
                  className="font-title uppercase mt-6"
                  style={{
                    fontSize: "clamp(0.65rem, 2.2vw, 1.15rem)",
                    letterSpacing: "0.2em",
                    color: "#1a1a1a",
                    opacity: 0.5,
                  }}
                >
                  More Info Soon
                </p>
              </div>
            </div>

            {/* Music player */}
            <div style={{ flex: "0 0 auto", display: "flex", alignItems: "stretch" }}>
              <MusicPlayer />
            </div>
          </div>

          {/* Button — full width below both columns */}
          <div style={{ marginTop: "clamp(0.75rem, 2vw, 1.5rem)" }}>
            <CTAButton />
          </div>
        </section>
      </main>

      <Marquee />

      </div> {/* end clip wrapper */}
    </>
  );
}

const ARTISTS = [
  "KIEFER",
  "LUKE TITUS",
  "SHIBO",
  "GENA",
  "KARRIEM RIGGINS",
  "LIV.E",
  "CARRTOONS",
];

const STAR_SVG = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#ef3b2d" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const MarqueeUnit = React.memo(function MarqueeUnit() {
  return (
    <>
      {ARTISTS.map((artist) => (
        <React.Fragment key={artist}>
          <span
            style={{
              fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
            }}
          >
            {artist}
          </span>
          {STAR_SVG}
        </React.Fragment>
      ))}
    </>
  );
});

const Marquee = React.memo(function Marquee() {
  return (
    <div
      style={{
        borderTop: "2.5px solid #1a1a1a",
        backgroundColor: "var(--paper)",
        overflow: "hidden",
        height: "2.8rem",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* 4 copies; -50% = exactly 2 copies = seamless loop */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "1.8rem",
          width: "max-content",
          animation: "otb-marquee 30s linear infinite",
        }}
      >
        <MarqueeUnit />
        <MarqueeUnit />
        <MarqueeUnit />
        <MarqueeUnit />
      </div>
    </div>
  );
});

function CTAButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#1a1a1a" : "var(--paper)",
        color: hovered ? "var(--paper)" : "#1a1a1a",
        border: "2.5px solid #1a1a1a",
        boxShadow: hovered ? "2px 2px 0 0 #ef3b2d" : "5px 5px 0 0 #1a1a1a",
        padding: "0.9rem 2.2rem",
        fontSize: "clamp(0.75rem, 2vw, 0.9rem)",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
        transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
        display: "inline-block",
        width: "100%",
      }}
      aria-label="Tickets and info coming soon"
    >
      Tickets / Info Coming Soon
    </button>
  );
}
