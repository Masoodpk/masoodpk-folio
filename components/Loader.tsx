"use client";

import { useEffect, useState } from "react";

/**
 * First-load screen: the hero's keycaps type "M P K" while the page loads,
 * then the screen lifts away in a burst of hero shards.
 *
 * - shown once per browser tab session, skipped for prefers-reduced-motion
 *   (an inline script in the layout adds .no-loader before first paint)
 * - stays at least MIN_MS so it never just flickers, and never longer than MAX_MS
 * - without JavaScript a CSS fallback hides it after 4s
 */
const SEEN_KEY = "folio:loaded";
const MIN_MS = 1300;
const MAX_MS = 3000;
const LETTERS = ["M", "P", "K"];

// A ring of shards; colour drifts warm (left) → cool (right), like the hero.
const SHARDS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2 + (i % 2 ? 0.18 : -0.12);
  const dist = 150 + ((i * 37) % 80);
  return {
    dx: Math.round(Math.cos(angle) * dist),
    dy: Math.round(Math.sin(angle) * dist),
    r: Math.round((angle * 180) / Math.PI),
    colour: Math.round(((Math.cos(angle) + 1) / 2) * 7),
  };
});

export default function Loader() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("no-loader")) {
      setPhase("done");
      return;
    }

    root.style.overflow = "hidden";
    let cancelled = false;
    let timer = 0;
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));
    const ready = Promise.all([new Promise((r) => setTimeout(r, MIN_MS)), loaded, document.fonts?.ready]);

    Promise.race([ready, new Promise((r) => setTimeout(r, MAX_MS))]).then(() => {
      if (cancelled) return;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      root.classList.remove("is-loading"); // lets the hero's entrance play as the screen lifts
      root.style.overflow = "";
      setPhase("exit");
      timer = window.setTimeout(() => setPhase("done"), 900);
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
      root.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div aria-hidden="true" className={`loader ${phase === "exit" ? "is-exiting" : ""}`}>
      <div className="loader-bg" />

      <div className="loader-inner">
        <span className="kb">
          <span className="kb-row">
            {LETTERS.map((l, i) => (
              <span key={l} className="key loader-key" style={{ "--n": i } as React.CSSProperties}>
                <span className="key-top">{l}</span>
              </span>
            ))}
          </span>
        </span>
        <span className="loader-bar">
          <span className="loader-bar-fill" />
        </span>
        <span className="label text-muted">
          <span className="text-accent">/</span> loading
        </span>
      </div>

      {SHARDS.map((s, i) => (
        <svg
          key={i}
          viewBox="0 0 12 12"
          className="loader-shard"
          style={
            {
              "--dx": `${s.dx}px`,
              "--dy": `${s.dy}px`,
              "--r": `${s.r}deg`,
              color: `var(--shard-${s.colour})`,
            } as React.CSSProperties
          }
        >
          <polygon points="11.5,3 0.5,8.2 2.6,10.4" fill="currentColor" />
        </svg>
      ))}
    </div>
  );
}
