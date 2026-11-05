"use client";

import { useEffect, useState } from "react";

/**
 * First-load screen. The hero's keycaps spelling "MASOOD PK" tumble down from
 * the top of the screen, land on a floor at the middle in a jumbled heap,
 * then hop into line so the name reads. The screen lifts away in a burst of
 * hero shards.
 *
 * - shown once per browser tab session, skipped for prefers-reduced-motion
 *   (an inline script in the layout adds .no-loader before first paint)
 * - stays at least MIN_MS so the animation can finish, never longer than MAX_MS
 * - without JavaScript a CSS fallback hides it
 */
const SEEN_KEY = "folio:loaded";
const MIN_MS = 3400;
const MAX_MS = 4800;
const WORD = "MASOOD PK";

/* Final key centres, in key widths (a key is 1 wide, 0.1 gap, the space 0.45 wide). */
const finals: number[] = [];
{
  let x = 0;
  for (const ch of WORD) {
    if (ch === " ") {
      x += 0.55;
      continue;
    }
    finals.push(x + 0.5);
    x += 1.1;
  }
}
const centre = (finals[0] + finals[finals.length - 1]) / 2;

/* Hand-tuned "random" heap: where each key lands, how it lies, how it tumbles. */
const HEAP = [3, 6, 0, 7, 2, 5, 1, 4]; // landing slot for each key, left → right
const JITTER = [0.2, -0.25, 0.1, -0.15, 0.3, -0.05, 0.15, -0.3];
const LIFT = [0.1, -0.05, 0.15, 0, 0.12, -0.08, 0.06, 0.18];
const TILT = [-28, 17, -9, 34, -21, 12, -36, 24];
const SPIN = [-160, 120, 200, -140, 90, -210, 170, -100];
const DROP = [2, 5, 0, 7, 3, 6, 1, 4]; // order the keys fall in
const HOP = [0.55, 0.9, 0.6, 1, 0.5, 0.85, 0.65, 0.95]; // how high each hops when lining up

const dropAt = (i: number) => +(DROP[i] * 0.08).toFixed(2);
const orderAt = (i: number) => +(1.7 + i * 0.08).toFixed(2); // left → right, so the name reads letter by letter

const KEYS = finals.map((fx, i) => {
  const landing = (HEAP[i] - 3.5) * 1.35 + JITTER[i];
  return {
    "--sx": `calc(var(--k) * ${(landing - (fx - centre)).toFixed(2)})`,
    "--sy": `calc(var(--k) * ${LIFT[i]})`,
    "--sr": `${TILT[i]}deg`,
    "--fr": `${SPIN[i]}deg`,
    "--h": `calc(var(--k) * -${HOP[i]})`,
    "--d": `${dropAt(i)}s`,
    "--o": `${orderAt(i)}s`,
  } as React.CSSProperties;
});

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

  let k = 0;
  return (
    <div aria-hidden="true" className={`loader ${phase === "exit" ? "is-exiting" : ""}`}>
      <div className="loader-bg" />

      <div className="loader-inner">
        <span className="loader-word kb">
          {[...WORD].map((ch, i) =>
            ch === " " ? (
              <span key={i} className="loader-space" />
            ) : (
              <span key={i} className="loader-slot" style={KEYS[k++]}>
                <span className="loader-floor" />
                <span className="key loader-key">
                  <span className="key-top">{ch}</span>
                </span>
              </span>
            ),
          )}
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
