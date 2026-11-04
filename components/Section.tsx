type Props = {
  id: string;
  index: number;
  label: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

/** A section with a small mono index heading: "[/ about] ──── 01", the label set on a keycap like the hero. */
export default function Section({ id, index, label, children, style }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rise scroll-mt-16 pb-20 lg:scroll-mt-24 lg:pb-28"
      style={style}
    >
      <h2 id={`${id}-title`} className="label mb-8 flex items-center gap-4 text-muted">
        <span className="key-label">
          <span className="text-accent">/</span> {label.toLowerCase()}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span aria-hidden="true" className="tabular-nums">
          {String(index).padStart(2, "0")}
        </span>
      </h2>
      {children}
    </section>
  );
}
