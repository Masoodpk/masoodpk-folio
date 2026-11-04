import Link from "next/link";
import { Fragment } from "react";

/**
 * Renders a plain string with two tiny bits of markup:
 *   [label](url)  → link in the accent colour
 *   *phrase*      → phrase in the accent colour (or the `emphasis` class)
 */
export default function RichText({ text, emphasis = "text-accent" }: { text: string; emphasis?: string }) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*([^*]+)\*/g;
  const out: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const [, label, href, phrase] = match;
    if (phrase) {
      out.push(
        <span key={match.index} className={emphasis}>
          {phrase}
        </span>,
      );
    } else if (href.startsWith("/")) {
      out.push(
        <Link key={match.index} href={href} className="link link-accent">
          {label}
        </Link>,
      );
    } else {
      out.push(
        <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="link link-accent">
          {label}
        </a>,
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));

  return <Fragment>{out}</Fragment>;
}
