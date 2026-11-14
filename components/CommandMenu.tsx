"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { nav, site } from "@/data/content";
import { copyEmail, switchTheme } from "@/lib/events";

type Command = { id: string; group: string; label: string; hint?: string; run: () => void };

/** Press "/" or ⌘K / Ctrl+K anywhere to open. */
export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);
  openRef.current = open;
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();

  const close = useCallback(() => {
    setOpen(false);
    restoreFocus.current?.focus?.();
  }, []);

  const goTo = useCallback(
    (id: string) => {
      if (pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      } else {
        router.push(`/#${id}`);
      }
    },
    [pathname, router],
  );

  const commands = useMemo<Command[]>(
    () => [
      ...nav.map((n) => ({ id: `go-${n.id}`, group: "Go to", label: n.label, run: () => goTo(n.id) })),
      { id: "projects", group: "Go to", label: "All projects", hint: "/projects", run: () => router.push("/projects") },
      { id: "copy", group: "Actions", label: "Copy email", hint: site.email, run: () => copyEmail(site.email) },
      {
        id: "theme",
        group: "Actions",
        label: resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        run: () => switchTheme(setTheme, resolvedTheme),
      },
      { id: "resume", group: "Actions", label: "Open resume", hint: "PDF", run: () => window.open(site.resume, "_blank") },
      { id: "github", group: "Elsewhere", label: "GitHub", run: () => window.open(site.links.github, "_blank") },
      { id: "linkedin", group: "Elsewhere", label: "LinkedIn", run: () => window.open(site.links.linkedin, "_blank") },
    ],
    [goTo, router, resolvedTheme, setTheme],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  // Global shortcuts + event from the ⌘K button
  useEffect(() => {
    const show = () => {
      restoreFocus.current = document.activeElement as HTMLElement;
      setQuery("");
      setIndex(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        if (openRef.current) setOpen(false);
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("folio:command", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("folio:command", show);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const run = (cmd?: Command) => {
    if (!cmd) return;
    setOpen(false);
    cmd.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[index]);
    } else if (e.key === "Tab") {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  let lastGroup = "";

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 px-4 pt-[14vh] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label="Command menu"
              onKeyDown={onKeyDown}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
              className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-bg shadow-[0_20px_60px_-20px_rgb(0_0_0/0.35)]"
            >
              <div className="flex items-center gap-3 border-b border-border px-4">
                <span className="label text-accent" aria-hidden="true">/</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIndex(0);
                  }}
                  placeholder="Type a command or search…"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="command-list"
                  aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
                  className="h-12 w-full bg-transparent text-[0.95rem] text-text outline-none focus-visible:outline-none placeholder:text-muted"
                />
                <kbd className="label rounded border border-border px-1.5 py-0.5 text-muted">esc</kbd>
              </div>

              <ul id="command-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
                {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Nothing found.</li>}
                {results.map((cmd, i) => {
                  const showGroup = cmd.group !== lastGroup;
                  lastGroup = cmd.group;
                  return (
                    <li key={cmd.id} role="presentation">
                      {showGroup && <p className="label px-3 pt-3 pb-1.5 text-muted">{cmd.group}</p>}
                      <div
                        id={`cmd-${cmd.id}`}
                        role="option"
                        aria-selected={i === index}
                        onMouseMove={() => setIndex(i)}
                        onClick={() => run(cmd)}
                        className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[0.95rem] ${
                          i === index ? "bg-surface text-text" : "text-text/80"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className={`h-px transition-all duration-200 ${i === index ? "w-3 bg-accent" : "w-0"}`}
                          />
                          {cmd.label}
                        </span>
                        {cmd.hint && <span className="truncate pl-4 font-mono text-xs text-muted">{cmd.hint}</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="label flex gap-4 border-t border-border px-4 py-2.5 text-muted">
                <span>↑↓ move</span>
                <span>↵ select</span>
                <span className="ml-auto">/ or ⌘K</span>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
