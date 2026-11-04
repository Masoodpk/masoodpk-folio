"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { switchTheme } from "@/lib/events";
import { MoonIcon, SunIcon } from "./Icons";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => switchTheme(setTheme, resolvedTheme)}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-text"
    >
      {mounted ? dark ? <SunIcon /> : <MoonIcon /> : <span className="size-5" />}
    </button>
  );
}
