import type { Metadata } from "next";
import { projects } from "@/data/content";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "All projects",
  description: "A complete list of the projects I've worked on, newest first.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const rows = [...projects].sort((a, b) => b.year - a.year);

  return (
    <PageShell>
      <p className="label text-muted">
        <span className="text-accent">/</span> work
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-[-0.02em] sm:text-5xl">All projects</h1>
      <p className="mt-4 max-w-xl text-muted">
        A complete list of the projects I&apos;ve worked on, newest first.
      </p>

      <table className="mt-14 w-full border-collapse text-left">
        <caption className="sr-only">Projects by year</caption>
        <thead>
          <tr className="label border-b border-border text-muted">
            <th scope="col" className="py-3 pr-4 font-normal">Year</th>
            <th scope="col" className="py-3 pr-4 font-normal">Project</th>
            <th scope="col" className="hidden py-3 pr-4 font-normal md:table-cell">Made at</th>
            <th scope="col" className="hidden py-3 pr-4 font-normal sm:table-cell">Built with</th>
            <th scope="col" className="hidden py-3 font-normal md:table-cell">Link</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const href = p.url ?? p.repo;
            const display = href?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
            return (
              <tr key={p.title} className="border-b border-border/70 align-top transition-colors hover:bg-surface/60">
                <td className="label py-4 pr-4 pt-[1.15rem] tabular-nums text-muted">{p.year}</td>
                <td className="py-4 pr-4 font-medium">
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="group hover:text-accent">
                      {p.title}
                      <span className="arrow ml-1 text-muted" aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    p.title
                  )}
                  <p className="mt-1 text-sm font-normal text-muted">{p.description}</p>
                </td>
                <td className="hidden py-4 pr-4 text-sm text-muted md:table-cell">{p.madeAt ?? "—"}</td>
                <td className="hidden py-4 pr-4 sm:table-cell">
                  <ul className="font-mono text-xs leading-6 text-muted">
                    {p.tags.map((tag) => (
                      <li key={tag} className="whitespace-nowrap">{tag}</li>
                    ))}
                  </ul>
                </td>
                <td className="hidden py-4 text-sm md:table-cell">
                  {href && (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="group whitespace-nowrap text-muted hover:text-accent">
                      <span className="link">{display}</span>
                      <span className="arrow ml-1" aria-hidden="true">↗</span>
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
  );
}
