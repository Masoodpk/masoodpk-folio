"use client";

import { site } from "@/data/content";
import { copyEmail, openCommandMenu } from "@/lib/events";
import { CopyIcon, FileIcon, GitHubIcon, LinkedInIcon } from "./Icons";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";

const iconLink = "grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-text";

export default function Socials() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 -ml-2">
        <a href={site.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className={iconLink}>
          <GitHubIcon />
        </a>
        <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className={iconLink}>
          <LinkedInIcon />
        </a>
        <a href={site.resume} target="_blank" rel="noopener noreferrer" aria-label="Resume PDF (opens in a new tab)" className={iconLink}>
          <FileIcon />
        </a>
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
        <SoundToggle />
        <ThemeToggle />
        <button
          type="button"
          onClick={openCommandMenu}
          aria-label="Open command menu"
          className="label ml-1 hidden rounded-md border border-border px-2 py-1 text-muted transition-colors hover:border-muted hover:text-text lg:inline-block"
        >
          ⌘K
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <a href={`mailto:${site.email}`} className="link text-muted hover:text-text">
          {site.email}
        </a>
        <button
          type="button"
          onClick={() => copyEmail(site.email)}
          aria-label="Copy email address"
          className="grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text"
        >
          <CopyIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
