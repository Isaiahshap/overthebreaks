"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const TRACKS = [
  { artist: "KIEFER", title: "APRIL C", src: "/music/April C 2021.mp3" },
  { artist: "KIEFER", title: "GOLD + SILVER", src: "/music/GOLD + SILVER UPDATE V5 83 BPM.mp3" },
];

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Sketchy SVG icons ─────────────────────────────────────────────────────────

function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M5.5 3.8 C5.3 3.6 4.9 3.5 4.7 3.7 C4.4 3.9 4.3 4.2 4.4 4.5 L4.4 17.5 C4.3 17.9 4.5 18.2 4.8 18.4 C5.1 18.5 5.4 18.4 5.7 18.2 L18.3 11.7 C18.6 11.5 18.8 11.2 18.7 10.9 C18.6 10.6 18.3 10.4 18 10.3 Z"
        fill="#ef3b2d"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M5.2 3.6 C4.8 3.5 4.5 3.7 4.4 4 C4.2 4.3 4.2 4.7 4.3 5 L4.3 17 C4.2 17.3 4.3 17.7 4.6 17.9 C4.9 18.1 5.3 18.1 5.6 18 L8.6 18 C8.9 18 9.2 17.8 9.4 17.5 C9.5 17.2 9.6 16.8 9.5 16.5 L9.5 5.5 C9.5 5.2 9.4 4.8 9.2 4.6 C9 4.3 8.6 4.2 8.3 4.2 Z"
        fill="#ef3b2d"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M13.4 3.6 C13 3.5 12.7 3.7 12.6 4 C12.4 4.3 12.4 4.7 12.5 5 L12.5 17 C12.4 17.3 12.5 17.7 12.8 17.9 C13.1 18.1 13.5 18.1 13.8 18 L16.8 18 C17.1 18 17.4 17.8 17.6 17.5 C17.7 17.2 17.8 16.8 17.7 16.5 L17.7 5.5 C17.7 5.2 17.6 4.8 17.4 4.6 C17.2 4.3 16.8 4.2 16.5 4.2 Z"
        fill="#ef3b2d"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PrevIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M15.5 4 C15.8 3.7 16.2 3.6 16.5 3.8 C16.8 4 17 4.4 16.9 4.8 L16.9 17.2 C16.9 17.6 16.7 17.9 16.4 18.1 C16 18.3 15.6 18.2 15.3 18 L6.5 12.3 C6.2 12.1 6 11.8 6 11.5 L6 10.5 C6 10.2 6.2 9.9 6.5 9.7 Z"
        fill="var(--paper)"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M5 4.5 C4.8 4.3 4.5 4.2 4.3 4.4 C4 4.6 3.9 5 4 5.3 L4 16.7 C3.9 17 4.1 17.4 4.4 17.5 C4.7 17.7 5 17.6 5.2 17.4 Z"
        fill="var(--paper)"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M6.5 4 C6.2 3.7 5.8 3.6 5.5 3.8 C5.2 4 5 4.4 5.1 4.8 L5.1 17.2 C5.1 17.6 5.3 17.9 5.6 18.1 C6 18.3 6.4 18.2 6.7 18 L15.5 12.3 C15.8 12.1 16 11.8 16 11.5 L16 10.5 C16 10.2 15.8 9.9 15.5 9.7 Z"
        fill="var(--paper)"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M17 4.5 C17.2 4.3 17.5 4.2 17.7 4.4 C18 4.6 18.1 5 18 5.3 L18 16.7 C18.1 17 17.9 17.4 17.6 17.5 C17.3 17.7 17 17.6 16.8 17.4 Z"
        fill="var(--paper)"
        stroke="#1a1a1a"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Vinyl disc ────────────────────────────────────────────────────────────────

function VinylDisc({ spinning }: { spinning: boolean }) {
  return (
    <div
      style={{
        width: 88,
        height: 88,
        animation: spinning ? "otb-spin 3s linear infinite" : "none",
        filter: "drop-shadow(2px 3px 0px #1a1a1a)",
      }}
    >
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
        <circle cx="44" cy="44" r="41" fill="#1a1a1a" stroke="var(--paper)" strokeWidth="2" />
        {/* Grooves */}
        {[34, 28, 22].map((r) => (
          <circle key={r} cx="44" cy="44" r={r} fill="none" stroke="var(--paper)" strokeWidth="0.6" opacity="0.2" />
        ))}
        {/* Red label */}
        <circle cx="44" cy="44" r="16" fill="#ef3b2d" />
        <circle cx="44" cy="44" r="16" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
        {/* Stars on label */}
        <polygon
          points="44,32 45.8,38.5 52.5,38.5 47.1,42.5 49,49 44,45 39,49 40.9,42.5 35.5,38.5 42.2,38.5"
          fill="var(--paper)"
          opacity="0.7"
        />
        {/* Centre hole */}
        <circle cx="44" cy="44" r="3.5" fill="#1a1a1a" stroke="var(--paper)" strokeWidth="1" />
      </svg>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [btnActive, setBtnActive] = useState(false);

  const track = TRACKS[trackIdx];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const wasPlaying = isPlaying;
    audio.pause();
    audio.src = track.src;
    audio.load();
    if (wasPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => setTrackIdx((i) => (i + 1) % TRACKS.length);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [trackIdx]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    setBtnActive(true);
    setTimeout(() => setBtnActive(false), 160);
  }, []);

  const goPrev = useCallback(() => {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  const goNext = useCallback(() => {
    setTrackIdx((i) => (i + 1) % TRACKS.length);
  }, []);

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
      <audio ref={audioRef} preload="metadata" />

      {/* Shared SVG filters */}
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

      {/* Rectangle box */}
      <div
        style={{
          backgroundColor: "#ef3b2d",
          border: "2.5px solid #1a1a1a",
          boxShadow: "5px 5px 0 0 #1a1a1a, -1px -1px 0 0 #1a1a1a",
          padding: "1.6rem 1.4rem 1.4rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          filter: "url(#otb-crayon-box)",
          // Slight tilt — like it was stuck to the poster
          transform: "rotate(0.6deg)",
          // Hatching texture overlay via repeating gradient
          backgroundImage:
            "repeating-linear-gradient(52deg, transparent, transparent 6px, rgba(26,26,26,0.04) 6px, rgba(26,26,26,0.04) 7px)",
        }}
      >
        {/* Header label */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Star />
          <span
            style={{
              fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              color: "var(--paper)",
              textTransform: "uppercase",
              textShadow: "1px 1px 0 #1a1a1a",
            }}
          >
            Now Playing
          </span>
          <Star />
        </div>

        {/* Vinyl */}
        <VinylDisc spinning={isPlaying} />

        {/* Track name */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, textAlign: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              color: "var(--paper)",
              textTransform: "uppercase",
              opacity: 0.75,
              textShadow: "1px 1px 0 #1a1a1a",
            }}
          >
            {track.artist}
          </span>
          <span
            style={{
              fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
              fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
              letterSpacing: "0.1em",
              color: "var(--paper)",
              textTransform: "uppercase",
              textShadow: "1.5px 1.5px 0 #1a1a1a, -0.5px 0.5px 0 #1a1a1a",
              lineHeight: 1.15,
            }}
          >
            {track.title}
          </span>
        </div>

        {/* Controls row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={goPrev}
            aria-label="Previous track"
            style={iconBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
          >
            <PrevIcon />
          </button>

          {/* Big play/pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "var(--paper)",
              border: "2.5px solid #1a1a1a",
              boxShadow: btnActive
                ? "1px 1px 0 0 #1a1a1a"
                : "3px 3px 0 0 #1a1a1a, -1px 0 0 0 #1a1a1a",
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
            onClick={goNext}
            aria-label="Next track"
            style={iconBtnStyle}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
          >
            <NextIcon />
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{
              width: "100%",
              height: 11,
              backgroundColor: "rgba(26,26,26,0.25)",
              border: "2px solid #1a1a1a",
              cursor: "none",
              position: "relative",
              overflow: "hidden",
              transform: "skewY(-0.5deg)",
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

          {/* Time stamps */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-anton), 'Arial Black', sans-serif",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              color: "var(--paper)",
              textShadow: "1px 1px 0 #1a1a1a",
            }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Track selector dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {TRACKS.map((t, i) => (
            <button
              key={t.src}
              onClick={() => setTrackIdx(i)}
              aria-label={`Play ${t.title}`}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                backgroundColor: i === trackIdx ? "var(--paper)" : "rgba(255,255,255,0.3)",
                border: "1.5px solid #1a1a1a",
                padding: 0,
                cursor: "none",
                transition: "background-color 0.2s",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 6,
  cursor: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0.85,
  transition: "opacity 0.1s",
};

function Star() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="var(--paper)" aria-hidden="true">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}
