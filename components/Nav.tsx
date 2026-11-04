"use client";

import { useEffect, useState } from "react";
import { nav } from "@/data/content";

/**
 * Section nav. A section is highlighted once its top reaches the middle of the
 * screen; at the very bottom of the page the last section wins, since a short
 * final section may never reach the middle.
 */
export default function Nav() {
  const [active, setActive] = useState<string>(nav[0].id);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    // a handful of rect reads per scroll event is cheap, so no throttling needed
    const update = () => {
      const line = window.innerHeight * 0.5;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = sections[0].id;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      if (atBottom) current = sections[sections.length - 1].id;
      setActive(current);
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
      <ul className="mt-14 space-y-1">
        {nav.map((item, i) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center gap-3 py-2"
              >
                <span className={`label tabular-nums transition-colors ${isActive ? "text-accent" : "text-muted"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-px transition-all duration-300 ease-out ${
                    isActive ? "w-14 bg-accent" : "w-6 bg-muted/60 group-hover:w-14 group-hover:bg-text"
                  }`}
                />
                <span
                  className={`label transition-colors ${
                    isActive ? "text-text" : "text-muted group-hover:text-text"
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
