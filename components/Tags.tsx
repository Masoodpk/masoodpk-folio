export default function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies used">
      {tags.map((tag) => (
        <li key={tag} className="keytag">
          {tag}
        </li>
      ))}
    </ul>
  );
}
