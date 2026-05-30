"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const TRACKS = [
  { artist: "KIEFER", title: "APRIL C", src: "/music/kiefer-april-c.mp3" },
  { artist: "KIEFER", title: "GOLD + SILVER", src: "/music/kiefer-gold-and-silver.mp3" },
  { artist: "SHIBO", title: "IF ONLY YOU CAN SEE", src: "/music/shibo-ifonlyyoucansee.mp3" },
  { artist: "SHIBO", title: "CZ101", src: "/music/shibo-cz101.mp3" },
];

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M5.5 3.8 C5.3 3.6 4.9 3.5 4.7 3.7 C4.4 3.9 4.3 4.2 4.4 4.5 L4.4 17.5 C4.3 17.9 4.5 18.2 4.8 18.4 C5.1 18.5 5.4 18.4 5.7 18.2 L18.3 11.7 C18.6 11.5 18.8 11.2 18.7 10.9 C18.6 10.6 18.3 10.4 18 10.3 Z"
        fill="#1a1a1a"
        stroke="#1a1a1a"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden="true">
      <rect x="4" y="3.5" width="4.5" height="15" rx="0.8" fill="#1a1a1a" />
      <rect x="13.5" y="3.5" width="4.5" height="15" rx="0.8" fill="#1a1a1a" />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden="true">
      <rect x="3" y="3.5" width="3.5" height="15" rx="0.6" fill="var(--paper)" />
      <polygon points="19,3.5 19,18.5 8,11" fill="var(--paper)" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 22 22" aria-hidden="true">
      <rect x="15.5" y="3.5" width="3.5" height="15" rx="0.6" fill="var(--paper)" />
      <polygon points="3,3.5 3,18.5 14,11" fill="var(--paper)" />
    </svg>
  );
}

function Star() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="var(--paper)" aria-hidden="true">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

// ── Pulsing bars indicator ────────────────────────────────────────────────────

function PlayingBars() {
  return (
    <span style={{ display: "inline-flex", alignItems: "flex-end", gap: 2, height: 14 }} aria-label="playing">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: 3,
            backgroundColor: "#1a1a1a",
            borderRadius: 1,
            animation: `otb-bar-${i} 0.7s ease-in-out ${i * 0.12}s infinite alternate`,
          }}
        />
      ))}
      <style>{`
        @keyframes otb-bar-1 { from { height: 4px } to { height: 13px } }
        @keyframes otb-bar-2 { from { height: 8px } to { height: 5px } }
        @keyframes otb-bar-3 { from { height: 3px } to { height: 11px } }
      `}</style>
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [btnActive, setBtnActive] = useState(false);

  const track = TRACKS[trackIdx];

  // Wire up audio event listeners once
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      const next = (isPlayingRef.current ? trackIdx + 1 : trackIdx) % TRACKS.length;
      loadTrack(next, true);
    };
    const onPlay = () => { isPlayingRef.current = true; setIsPlaying(true); };
    const onPause = () => { isPlayingRef.current = false; setIsPlaying(false); };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    // Initial load + autoplay attempt
    loadTrack(0, true);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrack = useCallback((i: number, play: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    setTrackIdx(i);
    setCurrentTime(0);
    setDuration(0);
    audio.pause();
    audio.src = TRACKS[i].src;
    audio.load();
    if (play) {
      audio.addEventListener("canplay", () => audio.play().catch(() => {}), { once: true });
    }
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) { audio.play().catch(() => {}); }
    else { audio.pause(); }
    setBtnActive(true);
    setTimeout(() => setBtnActive(false), 160);
  }, []);

  const selectTrack = useCallback((i: number) => {
    loadTrack(i, true);
  }, [loadTrack]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = progressRef.current;
      const audio = audioRef.current;
      if (!bar || !audio || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
    },
    [duration]
  );

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <>
      <audio ref={audioRef} preload="auto" />

      <svg width="0" height="0" style={{ position: "absolute", pointerEvents: "none" }} aria-hidden="true">
        <defs>
          <filter id="otb-crayon-box" x="-4%" y="-4%" width="108%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022 0.035" numOctaves="3" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="otb-crayon-btn" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.07" numOctaves="3" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          backgroundColor: "#ef3b2d",
          border: "2.5px solid #1a1a1a",
          boxShadow: "5px 5px 0 0 #1a1a1a, -1px -1px 0 0 #1a1a1a",
          padding: "1.2rem 1.2rem 1.1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.9rem",
          filter: "url(#otb-crayon-box)",
          transform: "rotate(0.6deg)",
          backgroundImage:
            "repeating-linear-gradient(52deg, transparent, transparent 6px, rgba(26,26,26,0.04) 6px, rgba(26,26,26,0.04) 7px)",
          minWidth: "clamp(160px, 36vw, 220px)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Star />
          <span style={labelStyle}>Now Playing</span>
          <Star />
        </div>

        {/* ── Track list ── */}
        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 0 }}>
          {TRACKS.map((t, i) => {
            const active = i === trackIdx;
            return (
              <li key={t.src}>
                {i > 0 && (
                  <div style={{ height: 1.5, backgroundColor: "rgba(26,26,26,0.25)", margin: "0 0" }} />
                )}
                <button
                  onClick={() => selectTrack(i)}
                  aria-current={active ? "true" : undefined}
                  style={{
                    width: "100%",
                    background: active ? "var(--paper)" : "transparent",
                    border: "none",
                    padding: "0.5rem 0.6rem",
                    cursor: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    textAlign: "left",
                    transition: "background 0.15s",
                  }}
                >
                  {/* Track number */}
                  <span
                    style={{
                      fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
                      fontSize: "0.6rem",
                      letterSpacing: "0.1em",
                      color: active ? "#ef3b2d" : "rgba(245,240,232,0.55)",
                      minWidth: 16,
                      textShadow: "none",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Title block */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
                        fontSize: "0.58rem",
                        letterSpacing: "0.18em",
                        color: active ? "rgba(26,26,26,0.55)" : "rgba(245,240,232,0.55)",
                        textTransform: "uppercase",
                        lineHeight: 1.2,
                      }}
                    >
                      {t.artist}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
                        fontSize: "clamp(0.75rem, 2.5vw, 0.92rem)",
                        letterSpacing: "0.06em",
                        color: active ? "#1a1a1a" : "var(--paper)",
                        textTransform: "uppercase",
                        textShadow: active ? "none" : "1px 1px 0 #1a1a1a",
                        lineHeight: 1.15,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.title}
                    </div>
                  </div>

                  {/* Playing indicator or track number */}
                  <div style={{ flexShrink: 0, width: 18, display: "flex", justifyContent: "flex-end" }}>
                    {active && isPlaying ? (
                      <PlayingBars />
                    ) : active ? (
                      <PlayIcon />
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>

        {/* Divider */}
        <div style={{ height: 2, backgroundColor: "rgba(26,26,26,0.3)" }} />

        {/* Progress bar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
              width: "100%",
              height: 10,
              backgroundColor: "rgba(26,26,26,0.25)",
              border: "2px solid #1a1a1a",
              cursor: "none",
              position: "relative",
              overflow: "hidden",
              transform: "skewY(-0.4deg)",
              boxShadow: "2px 2px 0 0 #1a1a1a",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: `${progress * 100}%`,
                backgroundColor: "var(--paper)",
                backgroundImage:
                  "repeating-linear-gradient(58deg, transparent, transparent 3px, rgba(26,26,26,0.08) 3px, rgba(26,26,26,0.08) 4px)",
                transition: "width 0.3s linear",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...labelStyle, fontSize: "0.55rem" }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Transport controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => selectTrack((trackIdx - 1 + TRACKS.length) % TRACKS.length)}
            aria-label="Previous track"
            style={ghostBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
          >
            <PrevIcon />
          </button>

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              backgroundColor: "var(--paper)",
              border: "2.5px solid #1a1a1a",
              boxShadow: btnActive ? "1px 1px 0 0 #1a1a1a" : "3px 3px 0 0 #1a1a1a, -1px 0 0 0 #1a1a1a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              transform: btnActive ? "translate(2px, 2px)" : "none",
              transition: "transform 0.1s ease, box-shadow 0.1s ease",
              filter: "url(#otb-crayon-btn)",
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            onClick={() => selectTrack((trackIdx + 1) % TRACKS.length)}
            aria-label="Next track"
            style={ghostBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.8")}
          >
            <NextIcon />
          </button>
        </div>
      </div>
    </>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
  fontSize: "0.65rem",
  letterSpacing: "0.22em",
  color: "var(--paper)",
  textTransform: "uppercase",
  textShadow: "1px 1px 0 #1a1a1a",
};

const ghostBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 6,
  cursor: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0.8,
  transition: "opacity 0.1s",
};
