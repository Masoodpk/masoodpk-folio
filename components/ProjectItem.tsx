import type { Project } from "@/data/content";
import Tags from "./Tags";
import Thumbnail from "./Thumbnail";

export default function ProjectItem({ project }: { project: Project }) {
  const href = project.url ?? project.repo;

  return (
    <div className="group relative isolate grid gap-4 sm:grid-cols-[7.5rem_1fr] sm:gap-6">
      <div
        aria-hidden="true"
        className="absolute -inset-x-4 -inset-y-4 -z-10 hidden rounded-lg transition-colors duration-200 lg:block lg:group-hover:bg-surface"
      />

      <div className="order-2 max-w-[10rem] sm:order-1 sm:max-w-none sm:pt-1">
        <Thumbnail image={project.image} mark={project.mark} title={project.title} />
      </div>

      <div className="order-1 sm:order-2">
        <h3 className="font-medium leading-snug text-text">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              <span aria-hidden="true" className="absolute -inset-x-4 -inset-y-4 rounded-lg" />
              <span className="transition-colors group-hover:text-accent">{project.title}</span>
              <span className="arrow ml-1 text-muted" aria-hidden="true">↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{project.description}</p>
        {project.stat && (
          <p className="label mt-3 text-text/80">
            <span className="text-accent" aria-hidden="true">◆ </span>
            {project.stat}
          </p>
        )}
        <Tags tags={project.tags} />
      </div>
    </div>
  );
}
