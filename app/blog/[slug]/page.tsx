import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/data/content";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";
import PageShell from "@/components/PageShell";
import ArrowLink from "@/components/ArrowLink";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date, authors: [site.name] },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const { meta, Content } = post;

  return (
    <PageShell back={{ href: "/blog", label: "All writing" }}>
      <article>
        <header className="mb-12 max-w-[68ch]">
          <p className="label text-muted">
            <time dateTime={meta.date}>{formatDate(meta.date)}</time>
            <span className="mx-2 text-accent">·</span>
            {meta.readingTime} min read
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.15] font-medium tracking-[-0.02em] text-balance sm:text-[2.75rem]">
            {meta.title}
          </h1>
          {meta.summary && <p className="mt-5 font-serif text-xl italic text-muted">{meta.summary}</p>}
        </header>

        <div className="prose-ink text-text/90">
          <Content />
        </div>
      </article>

      <div className="mt-16 max-w-[68ch] border-t border-border pt-8">
        <p className="text-muted">
          Thanks for reading. If this was useful, I&apos;d love to hear about it at{" "}
          <a href={`mailto:${site.email}`} className="link link-accent">{site.email}</a>.
        </p>
        <ArrowLink href="/blog">More writing</ArrowLink>
      </div>
    </PageShell>
  );
}
