"use client";

import { useEffect, useRef } from "react";

/**
 * "Shards": an empty hero until you move over it. The cursor then sprays a
 * trail of colourful glass-like slivers that fly outward, spin and dissolve.
 * A tap or click bursts a ring of them.
 *
 * Kept light on purpose:
 * - plain Canvas 2D, no libraries
 * - a fixed pool of shards (no allocations while animating)
 * - shards are batched by colour, so a frame is at most 8 fill calls
 * - the loop only runs while shards are alive (0% CPU when idle)
 * - disabled with prefers-reduced-motion
 * - mouse/trackpad devices only; touch phones and tablets skip it entirely
 */

type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number; // angle
  va: number; // spin
  len: number;
  wid: number;
  skew: number;
  age: number;
  life: number; // age >= life means the slot is free
  c: number; // palette index
};

const PALETTES = {
  light: ["#c2473d", "#d9785a", "#e0a679", "#c9b48a", "#8fae9b", "#4f8f9a", "#2f6690", "#1f4e79"],
  dark: ["#e0605a", "#f0937a", "#f2c49a", "#efe3c4", "#b5d0bf", "#7fb8c0", "#4f8fc6", "#2f6aa3"],
};

/** A mouse or trackpad: true on laptops/desktops, false on phones and tablets. */
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

const POOL = 900;
const DRAG = 0.94;

export default function Shards({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Cursor devices only: phones and tablets have no cursor to trail
    if (!window.matchMedia(FINE_POINTER).matches) return;

    let width = 0;
    let height = 0;
    let palette = PALETTES.light;
    const pool: Shard[] = Array.from({ length: POOL }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, a: 0, va: 0, len: 0, wid: 0, skew: 1, age: 1, life: 0, c: 0,
    }));
    let next = 0; // ring-buffer cursor: when full, the oldest slot is reused
    const buckets: number[][] = PALETTES.light.map(() => []);
    const last = { x: 0, y: 0, has: false };
    let running = false;
    let frame = 0;
    let prev = 0;

    const readPalette = () => {
      palette = document.documentElement.classList.contains("dark") ? PALETTES.dark : PALETTES.light;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, rect.width < 640 ? 1.5 : 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Spawn one shard at (x, y) travelling with (vx, vy). */
    const emit = (x: number, y: number, vx: number, vy: number) => {
      const s = pool[next];
      next = (next + 1) % POOL;
      s.x = x;
      s.y = y;
      s.vx = vx;
      s.vy = vy;
      s.a = Math.atan2(vy, vx) + (Math.random() - 0.5) * 0.5;
      s.va = (Math.random() - 0.5) * 0.12;
      s.len = 10 + Math.random() * 30;
      s.wid = 1.5 + Math.random() * 4.5;
      s.skew = 0.6 + Math.random() * 0.8;
      s.age = 0;
      s.life = 45 + Math.random() * 55;
      // colour drifts warm → cool from left to right, with a little mixing
      const t = x / width + (Math.random() - 0.5) * 0.25;
      s.c = Math.max(0, Math.min(palette.length - 1, Math.floor(t * palette.length)));
    };

    /** A spray of shards along the cursor's path from the last point to (x, y). */
    const trail = (x: number, y: number) => {
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) return;
      const ux = dx / dist;
      const uy = dy / dist;
      const speed = Math.min(dist, 60);
      const count = Math.min(14, Math.ceil(dist / 5));
      for (let k = 0; k < count; k++) {
        const t = (k + Math.random()) / count;
        const side = (Math.random() - 0.5) * speed * 0.22; // sideways spray
        const push = speed * (0.06 + Math.random() * 0.2); // along the motion
        emit(
          last.x + dx * t + (Math.random() - 0.5) * 10,
          last.y + dy * t + (Math.random() - 0.5) * 10,
          ux * push - uy * side,
          uy * push + ux * side,
        );
      }
    };

    const burst = (x: number, y: number) => {
      for (let k = 0; k < 40; k++) {
        const ang = Math.random() * Math.PI * 2;
        const v = 2 + Math.random() * 7;
        emit(x, y, Math.cos(ang) * v, Math.sin(ang) * v);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min((now - prev) / 16.67, 2.5);
      prev = now;
      ctx.clearRect(0, 0, width, height);
      for (const b of buckets) b.length = 0;

      let alive = 0;
      const drag = DRAG ** dt;
      for (let i = 0; i < POOL; i++) {
        const s = pool[i];
        if (s.age >= s.life) continue;
        s.age += dt;
        s.vx *= drag;
        s.vy *= drag;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.a += s.va * dt;
        if (s.age < s.life) {
          buckets[s.c].push(i);
          alive++;
        }
      }

      ctx.globalAlpha = 0.9;
      for (let b = 0; b < buckets.length; b++) {
        if (!buckets[b].length) continue;
        ctx.fillStyle = palette[b];
        ctx.beginPath();
        for (const i of buckets[b]) {
          const s = pool[i];
          // pop in quickly, then shrink away
          const k = Math.min(1, s.age / 5) * (1 - s.age / s.life) ** 0.7;
          const cx = Math.cos(s.a);
          const sy = Math.sin(s.a);
          const hl = (s.len * k) / 2;
          const hw = (s.wid * k) / 2;
          ctx.moveTo(s.x + cx * hl, s.y + sy * hl);
          ctx.lineTo(s.x - cx * hl - sy * hw, s.y - sy * hl + cx * hw);
          ctx.lineTo(s.x - cx * hl * s.skew + sy * hw, s.y - sy * hl * s.skew - cx * hw);
          ctx.closePath();
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (alive > 0) frame = requestAnimationFrame(loop);
      else running = false;
    };

    const wake = () => {
      if (running || document.hidden) return;
      running = true;
      prev = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const local = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
    };

    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (!p.inside) {
        last.has = false;
        return;
      }
      if (last.has) {
        trail(p.x, p.y);
        wake();
      }
      last.x = p.x;
      last.y = p.y;
      last.has = true;
    };
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      if (!p.inside) return;
      burst(p.x, p.y);
      last.x = p.x;
      last.y = p.y;
      last.has = true;
      wake();
    };
    const onLeave = () => (last.has = false);
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        running = false;
      } else wake();
    };
    const themeWatch = new MutationObserver(readPalette);

    readPalette();
    resize();
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      themeWatch.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none hidden [@media(hover:hover)_and_(pointer:fine)]:block ${className}`} />;
}
