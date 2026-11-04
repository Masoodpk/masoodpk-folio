export default function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.6875rem] leading-5 tracking-wide text-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
