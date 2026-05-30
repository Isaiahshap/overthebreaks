"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type TicketLink = {
  href: string;
  label: string;
};

type TicketOverlayProps = {
  open: boolean;
  tickets: TicketLink[];
  onClose: () => void;
};

function TicketButton({ href, label }: TicketLink) {
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
        boxShadow: hovered ? "3px 3px 0 0 #ef3b2d" : "6px 6px 0 0 #1a1a1a",
        padding: "clamp(1rem, 4vw, 3rem) clamp(1.25rem, 5vw, 4rem)",
        fontSize: "clamp(0.9rem, 3.2vw, 3.25rem)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
        transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        textAlign: "center",
        textDecoration: "none",
      }}
    >
      {label}
    </a>
  );
}

export default function TicketOverlay({ open, tickets, onClose }: TicketOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get tickets"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(1rem, 4vw, 2rem)",
        backgroundColor: "rgba(0, 0, 0, 0.82)",
        animation: "otb-lightbox-in 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          width: "min(92vw, 720px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(0.75rem, 2vw, 1.25rem)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{
            alignSelf: "flex-end",
            width: "clamp(2.25rem, 5vw, 3rem)",
            height: "clamp(2.25rem, 5vw, 3rem)",
            border: "2.5px solid #1a1a1a",
            backgroundColor: closeHovered ? "#1a1a1a" : "var(--paper)",
            color: closeHovered ? "var(--paper)" : "#1a1a1a",
            boxShadow: closeHovered ? "2px 2px 0 0 #ef3b2d" : "4px 4px 0 0 #1a1a1a",
            fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
            lineHeight: 1,
            cursor: "pointer",
            transition: "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
          }}
        >
          ×
        </button>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.75rem, 2vw, 1.25rem)",
          }}
        >
          {tickets.map((ticket) => (
            <TicketButton key={ticket.href} {...ticket} />
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
