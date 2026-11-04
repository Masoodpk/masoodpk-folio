"use client";

import { useEffect, useState } from "react";
import { nav } from "@/data/content";

/** Section nav; the section in view is highlighted via IntersectionObserver. */
export default function Nav() {
  const [active, setActive] = useState<string>(nav[0].id);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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
