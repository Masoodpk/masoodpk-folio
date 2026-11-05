"use client";

import { useEffect, useState } from "react";

/**
 * A quiet hint under the hero keycaps, so visitors know they can press them.
 * Fades out once they press a key (Keycaps fires "folio:key"); the space stays
 * so nothing below jumps.
 */
export default function KeyHint() {
  const [used, setUsed] = useState(false);

  useEffect(() => {
    const onKey = () => setUsed(true);
    window.addEventListener("folio:key", onKey, { once: true });
    return () => window.removeEventListener("folio:key", onKey);
  }, []);

  return (
    <p
      aria-hidden="true"
      className={`label mt-5 text-muted transition-opacity duration-700 ${used ? "opacity-0" : "opacity-100"}`}
    >
      <span className="text-accent">↑</span>{" "}
      <span className="hidden [@media(hover:hover)]:inline">Press a key, or just type</span>
      <span className="[@media(hover:hover)]:hidden">Tap a key</span>
    </p>
  );
}
