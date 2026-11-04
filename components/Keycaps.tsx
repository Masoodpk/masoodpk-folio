"use client";

import { useEffect, useRef } from "react";
import { playKey, prepareKeySound } from "@/lib/keySound";

/**
 * Renders text as a row of classic keycaps, one per letter. Click or tap a
 * key to press it; while the keys are on screen,
 * typing those letters presses them too. Each letter has its own press and
 * release sound. One line from tablet width up, one row per word on phones.
 */
export default function Keycaps({ text, className = "" }: { text: string; className?: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Load the small key-sound file once the page is idle.
    const idle = (window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300))) as (cb: () => void) => number;
    idle(() => void prepareKeySound());

    const keysFor = (letter: string) =>
      root.querySelectorAll<HTMLElement>(`[data-key="${CSS.escape(letter.toLowerCase())}"]`);

    const down = (keys: Iterable<HTMLElement>, letter: string) => {
      for (const k of keys) k.classList.add("is-down");
      playKey(letter, "down");
      navigator.vibrate?.(6);
    };
    const up = (keys: Iterable<HTMLElement>, letter: string) => {
      let any = false;
      for (const k of keys) {
        any ||= k.classList.contains("is-down");
        k.classList.remove("is-down");
      }
      if (any) playKey(letter, "up");
    };

    // Pointer: mouse, pen or touch
    let held: HTMLElement | null = null;
    const onPointerDown = (e: PointerEvent) => {
      const key = (e.target as HTMLElement).closest<HTMLElement>("[data-key]");
      if (!key) return;
      e.preventDefault();
      held = key;
      down([key], key.dataset.key!);
    };
    const release = () => {
      if (held) up([held], held.dataset.key!);
      held = null;
    };

    // Physical keyboard, only while the keys are visible
    let visible = false;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(root);

    const ignore = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      return (
        !visible ||
        e.repeat ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.key.length !== 1 ||
        t.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)
      );
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (ignore(e)) return;
      const keys = keysFor(e.key);
      if (keys.length) down(keys, e.key);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key.length === 1) up(keysFor(e.key), e.key);
    };

    root.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      io.disconnect();
      root.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <span ref={rootRef} className={`kb ${className}`}>
      <span className="sr-only">{text}</span>
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="kb-row">
          {[...word].map((ch, i) => (
            <span key={i} data-key={ch.toLowerCase()} className="key">
              <span className="key-top">{ch}</span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
