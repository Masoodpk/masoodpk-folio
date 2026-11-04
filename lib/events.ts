"use client";

/** Tiny window-event helpers so components can talk without a global store. */

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("folio:toast", { detail: message }));
}

export function openCommandMenu() {
  window.dispatchEvent(new Event("folio:command"));
}

export async function copyEmail(email: string) {
  try {
    await navigator.clipboard.writeText(email);
    toast("Copied");
  } catch {
    toast(email);
  }
}

/** Switch theme with a short colour transition (skipped for reduced motion). */
export function switchTheme(setTheme: (t: string) => void, current: string | undefined) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) {
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 400);
  }
  setTheme(current === "dark" ? "light" : "dark");
}
