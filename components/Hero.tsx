import Image from "next/image";
import { site } from "@/data/content";
import Keycaps from "./Keycaps";
import KeyHint from "./KeyHint";
import SoundToggle from "./SoundToggle";
import ThemeToggle from "./ThemeToggle";
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./Icons";

const socials = [
  { label: "GitHub", href: site.links.github, Icon: GitHubIcon, external: true },
  { label: "LinkedIn", href: site.links.linkedin, Icon: LinkedInIcon, external: true },
  { label: "Email", href: `mailto:${site.email}`, Icon: MailIcon, external: false },
  { label: "Resume", href: site.resume, Icon: FileIcon, external: true },
];

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Full-screen intro: photo, name, role and links. */
export default function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[560px] h-svh items-center justify-center overflow-hidden px-6"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48"
        style={{ background: "linear-gradient(to bottom, color-mix(in srgb, var(--bg) 0%, transparent), var(--bg))" }}
      />

      <div className="absolute right-4 top-4 flex items-center gap-1 sm:right-6 sm:top-6">
        <SoundToggle />
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center text-center">
        <div
          className="rise relative size-32 overflow-hidden rounded-full border border-border bg-surface shadow-[0_10px_40px_-12px_rgb(0_0_0/0.25)] sm:size-40"
          style={stagger(0)}
        >
          <Image
            src={site.photo}
            alt={`Portrait of ${site.name}`}
            fill
            priority
            sizes="160px"
            className="object-cover"
          />
        </div>

        <h1
          className="rise mt-8 font-serif text-5xl leading-none font-medium tracking-[-0.025em] text-text sm:text-7xl md:text-8xl"
          style={stagger(1)}
        >
          {site.name}
          <span className="text-accent">.</span>
        </h1>

        <div className="rise mt-7" style={stagger(2)}>
          <Keycaps text={site.role} />
          <KeyHint />
        </div>

        <ul className="rise mt-9 flex items-center gap-2" style={stagger(3)}>
          {socials.map(({ label, href, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={external ? `${label} (opens in a new tab)` : label}
                title={label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="grid size-11 place-items-center rounded-full border border-transparent text-muted transition-colors hover:border-border hover:bg-bg/70 hover:text-accent"
              >
                <Icon className="size-[22px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#about"
        className="rise group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-muted hover:text-text"
        style={stagger(5)}
      >
        <span className="label">Scroll</span>
        <span aria-hidden="true" className="h-10 w-px bg-border transition-colors group-hover:bg-accent" />
      </a>
    </section>
  );
}
