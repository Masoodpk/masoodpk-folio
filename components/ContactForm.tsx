"use client";

import { useRef, useState } from "react";
import { site } from "@/data/content";
import { toast } from "@/lib/events";
import { playKey } from "@/lib/keySound";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full border-0 border-b border-border bg-transparent px-0 py-1.5 text-text placeholder:text-muted/60 transition-colors focus:border-accent focus-visible:outline-none";

/**
 * Contact form in the same spec-sheet layout as Skills and Experience: mono
 * labels in a left column, quiet underlined fields, and a keycap Send key.
 * Posts to /api/contact, which emails the message on.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Couldn't send right now.");
      setStatus("sent");
      toast("Message sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't send right now.");
    }
  };

  // ⌘/Ctrl + Enter sends from the message box
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const press = () => {
    playKey("s", "down");
    const release = () => {
      playKey("s", "up");
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
  };

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-border bg-surface px-5 py-6" role="status">
        <p className="label flex items-center gap-2 text-accent">
          <span aria-hidden="true">✓</span> Sent
        </p>
        <p className="mt-3 text-text/90">Thanks for the note. I usually reply within a day or two.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link label mt-5 text-muted hover:text-text"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <>
      <p className="mb-10 text-text/90">
        Have a role, a project, or just want to say hi? Leave a note and it lands straight in my inbox.
      </p>

      <form ref={formRef} onSubmit={onSubmit} className="space-y-7">
        <Row id="c-name" label="Name">
          <input id="c-name" name="name" type="text" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
        </Row>
        <Row id="c-email" label="Email">
          <input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@example.com" className={field} />
        </Row>
        <Row id="c-message" label="Message">
          <textarea
            id="c-message"
            name="message"
            required
            minLength={2}
            maxLength={5000}
            rows={5}
            onKeyDown={onKeyDown}
            placeholder="What's on your mind?"
            className={`${field} resize-y leading-relaxed`}
          />
        </Row>

        {/* Honeypot: hidden from people and screen readers, bots fill it in */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input name="company" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
          <span aria-hidden="true" />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="submit" onPointerDown={press} disabled={status === "sending"} className="key-btn">
              {status === "sending" ? "Sending…" : "Send"}
              <span aria-hidden="true" className="key-btn-glyph">⏎</span>
            </button>
            <span className="label hidden text-muted [@media(hover:hover)]:inline">
              or <span className="text-text">⌘ ⏎</span>
            </span>
          </div>
        </div>

        <p role="alert" aria-live="polite" className="min-h-[1.5rem] text-sm sm:pl-[calc(7.5rem+1.5rem)]">
          {status === "error" && (
            <span className="text-muted">
              <span className="text-[var(--shard-0)]">{error}</span> You can also email me at{" "}
              <a href={`mailto:${site.email}`} className="link-accent link">
                {site.email}
              </a>
              .
            </span>
          )}
        </p>
      </form>
    </>
  );
}

function Row({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
      <label htmlFor={id} className="label pt-3 text-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
