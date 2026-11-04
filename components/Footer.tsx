import { site } from "@/data/content";

export default function Footer() {
  return (
    <footer className="label border-t border-border pt-8 pb-16 leading-relaxed text-muted lg:pb-0">
      Designed &amp; built by {site.name} · Next.js &amp; Tailwind
    </footer>
  );
}
