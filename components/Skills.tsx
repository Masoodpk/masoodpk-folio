"use client";

import { skills } from "@/data/content";
import { playKey } from "@/lib/keySound";

/** A quiet mono slash between skills, the same "/" the site uses in "/ index". */
function Sep() {
  return (
    <span aria-hidden="true" className="mx-2.5 font-mono text-[0.85em] text-muted/45 select-none">
      /
    </span>
  );
}

/**
 * Skills as a compact spec sheet: one row per group, with the same
 * mono label column as Experience and a quiet slash between the skills.
 * Each skill lights up on hover and clicks like a key when pressed.
 */
export default function Skills() {
  const press = (e: React.PointerEvent<HTMLSpanElement>) => {
    const letter = e.currentTarget.textContent?.[0] ?? "a";
    playKey(letter, "down");
    const release = () => {
      playKey(letter, "up");
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
  };

  return (
    <dl className="space-y-6">
      {skills.map(({ group, items }) => (
        <div key={group} className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
          <dt className="label pt-1.5 text-muted">{group}</dt>
          <dd>
            <ul className="flex flex-wrap leading-7" aria-label={group}>
              {items.map((item, i) => (
                <li key={item} className="whitespace-nowrap">
                  <span
                    onPointerDown={press}
                    className="cursor-pointer text-text/90 transition-colors select-none hover:text-accent"
                  >
                    {item}
                  </span>
                  {i < items.length - 1 && <Sep />}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
