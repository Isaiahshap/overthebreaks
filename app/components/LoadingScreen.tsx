"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Remove from DOM after site reveal is fully done
    // 700ms spin + 2400ms reveal + 400ms buffer
    const t = setTimeout(() => setGone(true), 3500);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <>
      <style>{`
        @keyframes otb-slow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .otb-star-slow {
          animation: otb-slow-spin 3.5s linear infinite;
          transform-origin: 50px 50px;
          will-change: transform;
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 10,
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="96"
          height="96"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Slightly irregular points for a hand-drawn feel */}
          <polygon
            className="otb-star-slow"
            points="50,7 62,36 93,36 69,56 78,87 50,69 22,87 31,56 7,36 38,36"
            fill="#7B1728"
          />
        </svg>
      </div>
    </>
  );
}
