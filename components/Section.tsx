type Props = {
  id: string;
  index: number;
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/**
 * A section with a typographic heading: the nav number in mono, the name in
 * the serif, then a hairline. Keycaps are kept for things you can press
 * (tech tags, the hero role), so headings and tags never look alike.
 */
export default function Section({ id, index, label, children, style }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rise scroll-mt-16 pb-20 lg:scroll-mt-24 lg:pb-28"
      style={style}
    >
      <h2 id={`${id}-title`} className="mb-10 flex items-baseline gap-4">
        <span aria-hidden="true" className="label tabular-nums text-accent">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-serif text-[1.75rem] leading-none font-normal tracking-[-0.015em] text-text">
          {label}
        </span>
        <span aria-hidden="true" className="h-px flex-1 self-center bg-border" />
      </h2>
      {children}
    </section>
  );
}
