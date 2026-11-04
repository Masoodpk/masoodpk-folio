"use client";

import { useEffect, useState } from "react";
import { isMuted, setMuted } from "@/lib/keySound";
import { SoundOffIcon, SoundOnIcon } from "./Icons";

/** Mutes or unmutes the keycap sounds. Sits beside the theme toggle. */
export default function SoundToggle() {
  const [muted, setState] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => setState(isMuted());
    sync();
    window.addEventListener("folio:sound", sync);
    return () => window.removeEventListener("folio:sound", sync);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setMuted(!muted)}
      aria-label={muted ? "Unmute key sounds" : "Mute key sounds"}
      aria-pressed={muted ?? undefined}
      title={muted ? "Unmute key sounds" : "Mute key sounds"}
      className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-text"
    >
      {muted === null ? <span className="size-5" /> : muted ? <SoundOffIcon /> : <SoundOnIcon />}
    </button>
  );
}
