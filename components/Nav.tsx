"use client";

import { useEffect, useRef, useState } from "react";
import { nav } from "@/data/content";

/**
 * Section nav. A section becomes active once its top passes 40% down the
 * screen; at the very bottom of the page the last section wins, since a short
 * final section may never get that far.
 *
 * The active row stands out clearly: its number and label go full strength,
 * the other rows fade back, and its bar is longer and fills with the accent
 * as you read through that section, so you can see where you are in it.
 */
export default function Nav() {
  const [active, setActive] = useState<string>(nav[0].id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    // a handful of rect reads per scroll event is cheap, so no throttling needed
    const update = () => {
      const line = window.innerHeight * 0.4;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let i = 0;
      sections.forEach((s, n) => {
        if (s.getBoundingClientRect().top <= line) i = n;
      });
      if (atBottom) i = sections.length - 1;

      // how far the reading line has travelled through the active section
      const r = sections[i].getBoundingClientRect();
      const p = atBottom ? 1 : Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)));
      listRef.current?.style.setProperty("--nav-p", Math.max(0.08, p).toFixed(3));
      setActive(sections[i].id);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav aria-label="Sections" className="hidden lg:block">
      <ul ref={listRef} className="mt-14 space-y-1">
        {nav.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`group flex items-center gap-3 py-2 transition-opacity duration-300 ${
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
              >
                <span className={`label tabular-nums transition-colors ${isActive ? "text-accent" : "text-muted"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className={`relative h-0.5 overflow-hidden rounded-full transition-all duration-300 ease-out ${
                    isActive ? "w-20 bg-accent/20" : "w-6 bg-muted/60 group-hover:w-10 group-hover:bg-text"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 origin-left scale-x-[var(--nav-p,0.08)] bg-accent transition-transform duration-150 ease-out" />
                  )}
                </span>
                <span
                  className={`label transition-colors ${
                    isActive ? "font-semibold text-text" : "text-muted group-hover:text-text"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
