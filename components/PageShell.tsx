import Link from "next/link";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";

/** Single-column wrapper for inner pages (/projects, /blog, posts). */
export default function PageShell({
  back = { href: "/", label: "Home" },
  children,
}: {
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-[880px] px-6 sm:px-10">
      <header className="rise flex items-center justify-between pt-10 pb-14 sm:pt-16">
        <Link href={back.href} className="group inline-flex items-center gap-2 text-muted hover:text-text">
          <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
          <span className="label">{back.label}</span>
        </Link>
        <ThemeToggle />
      </header>
      <main id="content" tabIndex={-1} className="rise pb-24 outline-none" style={{ "--i": 1 } as React.CSSProperties}>
        {children}
      </main>
      <div className="pb-12">
        <Footer />
      </div>
    </div>
  );
}
