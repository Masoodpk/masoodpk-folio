"use client";

import { skills } from "@/data/content";
import { playKey } from "@/lib/keySound";

/** A single glass sliver, the same shape the hero's cursor sprays. */
function Shard({ index, count }: { index: number; count: number }) {
  // colour drifts warm → cool along the row, like the hero; every shard leans the same way
  const colour = Math.round((index / Math.max(1, count - 1)) * 7);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="mx-2.5 inline-block size-[0.8em] -rotate-[35deg] align-[-0.05em] opacity-90"
      style={{ color: `var(--shard-${colour})` }}
    >
      <polygon points="11.5,3 0.5,8.2 2.6,10.4" fill="currentColor" />
    </svg>
  );
}

/**
 * Skills as a compact spec sheet: one row per group, with the same
 * mono label column as Experience and hero shards between the skills.
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
                  {i < items.length - 1 && <Shard index={i} count={items.length - 1} />}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      ))}
    </dl>
  );
}
