"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";

/** A quiet toast at the bottom of the screen, e.g. "Copied". */
export default function Toaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: number;
    const onToast = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setMessage(null), 1800);
    };
    window.addEventListener("folio:toast", onToast);
    return () => {
      window.removeEventListener("folio:toast", onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {message && (
            <m.div
              key={message}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="label flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-text shadow-sm"
            >
              <span aria-hidden="true" className="text-accent">✓</span>
              {message}
            </m.div>
          )}
        </AnimatePresence>
      </LazyMotion>
    </div>
  );
}
