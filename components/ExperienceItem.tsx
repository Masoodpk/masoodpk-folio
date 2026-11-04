import type { Experience } from "@/data/content";
import Tags from "./Tags";

export default function ExperienceItem({ item }: { item: Experience }) {
  const title = (
    <>
      {item.role} <span className="text-muted">·</span> {item.company}
      {item.url && <span className="arrow ml-1 text-muted" aria-hidden="true">↗</span>}
    </>
  );

  return (
    <div className="group relative isolate grid gap-1 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
      {/* faint hover card */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-4 -inset-y-4 -z-10 hidden rounded-lg transition-colors duration-200 lg:block lg:group-hover:bg-surface"
      />

      <p className="label pt-1.5 text-muted">
        {item.start} — {item.end}
        <span className="mt-1 block normal-case tracking-normal text-muted/80">{item.location}</span>
      </p>

      <div>
        <h3 className="font-medium leading-snug text-text">
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {/* stretch the link over the whole card */}
              <span aria-hidden="true" className="absolute -inset-x-4 -inset-y-4 rounded-lg" />
              <span className="transition-colors group-hover:text-accent">{title}</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            title
          )}
        </h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{item.description}</p>
        <Tags tags={item.tags} />
      </div>
    </div>
  );
}
