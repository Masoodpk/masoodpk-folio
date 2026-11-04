import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="mx-auto flex min-h-screen max-w-[880px] flex-col justify-center px-6 sm:px-10">
      <p className="rise label text-muted">
        <span className="text-accent">/</span> error 404
      </p>
      <h1
        className="rise mt-4 font-serif text-5xl font-medium tracking-[-0.02em] sm:text-7xl"
        style={{ "--i": 1 } as React.CSSProperties}
      >
        Page not found<span className="text-accent">.</span>
      </h1>
      <p className="rise mt-6 max-w-md text-lg text-muted" style={{ "--i": 2 } as React.CSSProperties}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rise group mt-10 inline-flex w-fit items-center gap-2 font-medium"
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <span className="transition-transform group-hover:-translate-x-1 text-accent" aria-hidden="true">←</span>
        <span className="link">Back to home</span>
      </Link>
    </main>
  );
}
