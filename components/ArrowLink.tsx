import Link from "next/link";

/** "View all projects →" style link. */
export default function ArrowLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const className = "group mt-12 inline-flex items-center gap-2 font-medium text-text";
  const inner = (
    <>
      <span className="link">{children}</span>
      <span className="arrow-right text-accent" aria-hidden="true">→</span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
