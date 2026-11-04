import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllPosts } from "@/lib/posts";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on building for the web: performance, TypeScript, and small details.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();
  if (posts.length === 0) notFound();
  const byYear = Object.entries(
    posts.reduce<Record<string, typeof posts>>((acc, p) => {
      (acc[p.date.slice(0, 4)] ??= []).push(p);
      return acc;
    }, {}),
  ).sort(([a], [b]) => Number(b) - Number(a));

  return (
    <PageShell>
      <p className="label text-muted">
        <span className="text-accent">/</span> writing
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.02em] sm:text-5xl">Notes &amp; essays</h1>
      <p className="mt-4 max-w-xl text-muted">
        Things I learned the slow way, written down so I don&apos;t have to learn them twice.
      </p>

      <div className="mt-14 space-y-12">
        {byYear.map(([year, list]) => (
          <section key={year} aria-labelledby={`y-${year}`} className="grid gap-4 sm:grid-cols-[6rem_1fr]">
            <h2 id={`y-${year}`} className="label pt-5 text-muted tabular-nums">{year}</h2>
            <ul className="dim-list -mx-4">
              {list.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block rounded-lg px-4 py-4 transition-colors lg:hover:bg-surface">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="font-serif text-xl text-text transition-colors group-hover:text-accent">{post.title}</span>
                      <span className="label text-muted">
                        <time dateTime={post.date}>{formatDate(post.date, "short")}</time> · {post.readingTime} min
                      </span>
                    </span>
                    {post.summary && <span className="mt-1 block text-[0.95rem] text-muted">{post.summary}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
