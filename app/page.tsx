"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import MusicPlayer from "./components/MusicPlayer";
import TicketOverlay from "./components/TicketOverlay";

const CustomCursor = dynamic(() => import("./components/CustomCursor"), {
  ssr: false,
});

const LoadingScreen = dynamic(() => import("./components/LoadingScreen"), {
  ssr: false,
});

const POSTER_COLORS = ["#ef3b2d", "#f26aa5", "#f5c400", "#006b55", "#8fa4e8"] as const;

const POSTERS = [
  {
    src: "/posters/poster1.webp",
    alt: "Over the Breaks — Poster 1",
    objectPosition: "left center",
  },
  {
    src: "/posters/poster2.webp",
    alt: "Over the Breaks — Poster 2",
  },
] as const;

const TICKET_LINKS = [
  {
    href: "https://www.lodgeroomhlp.com/shows/kiefer-presents-over-the-breaks/",
    label: "Tickets for night 1",
  },
  {
    href: "https://www.lodgeroomhlp.com/shows/kiefer-presents-over-the-breaks-2/",
    label: "Tickets for night 2",
  },
] as const;

function PosterFrame({
  children,
  rotate,
  onClick,
}: {
  children: React.ReactNode;
  rotate: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label="Get tickets"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? `rotate(0deg) scale(1.03)` : `rotate(${rotate})`,
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        willChange: "transform",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
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
    </button>
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

  const [ticketsOpen, setTicketsOpen] = useState(false);

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

      <TicketOverlay
        open={ticketsOpen}
        tickets={[...TICKET_LINKS]}
        onClose={() => setTicketsOpen(false)}
      />

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
          {POSTERS.map((poster, index) => (
            <PosterFrame
              key={poster.src}
              rotate={index === 0 ? "-1.8deg" : "1.5deg"}
              onClick={() => setTicketsOpen(true)}
            >
              <div
                style={{
                  width: "clamp(260px, 36vw, 420px)",
                  aspectRatio: "616/767",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: index === 0 ? "#d4cfc5" : "#c9c2b8",
                }}
              >
                <Image
                  src={poster.src}
                  alt={poster.alt}
                  fill
                  style={{
                    objectFit: "cover",
                    objectPosition: "objectPosition" in poster ? poster.objectPosition : "center",
                  }}
                  priority={index === 0}
                />
              </div>
            </PosterFrame>
          ))}
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
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ul className="list-none p-0 m-0 space-y-2">
                  {[
                    { text: "2 Nights at Lodge Room", size: "clamp(1.15rem, 5vw, 2.5rem)" },
                    { text: "September 18 + 19", size: "clamp(1.55rem, 7vw, 3.4rem)" },
                    { text: "Highland Park, Los Angeles", size: "clamp(1.05rem, 4.5vw, 2.2rem)" },
                  ].map(({ text, size }) => (
                    <li
                      key={text}
                      className="font-title uppercase"
                      style={{
                        fontSize: size,
                        letterSpacing: "0.05em",
                        color: "#1a1a1a",
                        lineHeight: 1.2,
                        textAlign: "center",
                      }}
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Music player */}
            <div style={{ flex: "0 0 auto", display: "flex", alignItems: "stretch" }}>
              <MusicPlayer />
            </div>
          </div>

          {/* Ticket buttons — full width below both columns */}
          <div
            style={{
              marginTop: "clamp(0.75rem, 2vw, 1.5rem)",
              display: "flex",
              gap: "clamp(0.75rem, 2vw, 1.5rem)",
            }}
          >
            {TICKET_LINKS.map((ticket) => (
              <CTAButton key={ticket.href} {...ticket} />
            ))}
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

function CTAButton({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: hovered ? "#1a1a1a" : "var(--paper)",
        color: hovered ? "var(--paper)" : "#1a1a1a",
        border: "2.5px solid #1a1a1a",
        boxShadow: hovered ? "2px 2px 0 0 #ef3b2d" : "5px 5px 0 0 #1a1a1a",
        padding: "1rem clamp(0.75rem, 2vw, 1.5rem)",
        fontSize: "clamp(0.9rem, 3.2vw, 1.35rem)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
        transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "1 1 0",
        minWidth: 0,
        textAlign: "center",
        textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}

