import Image from "next/image";
import type { Mark } from "@/data/content";

/**
 * Project thumbnail. Uses `image` when given, otherwise draws a small
 * line-art tile so the list looks considered before real screenshots exist.
 */
export default function Thumbnail({ image, mark = "lines", title }: { image?: string; mark?: Mark; title: string }) {
  if (image) {
    return (
      <Image
        src={image}
        alt=""
        width={240}
        height={150}
        className="aspect-[8/5] w-full rounded-md border border-border object-cover"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative aspect-[8/5] w-full overflow-hidden rounded-md border border-border bg-surface/60 transition-colors group-hover:border-muted/50"
    >
      <svg viewBox="0 0 160 100" className="absolute inset-0 size-full text-muted" fill="none" stroke="currentColor" strokeWidth="1">
        <Pattern mark={mark} />
      </svg>
      <span className="absolute bottom-1.5 left-2 font-serif text-sm italic text-text/70">{title.charAt(0)}</span>
    </div>
  );
}

function Pattern({ mark }: { mark: Mark }) {
  const accent = { stroke: "var(--accent)", strokeWidth: 1.5 };
  switch (mark) {
    case "lines":
      return (
        <g opacity="0.7">
          {[24, 36, 48, 60, 72].map((y, i) => (
            <line key={y} x1="28" x2={[132, 110, 124, 96, 118][i]} y1={y} y2={y} {...(i === 2 ? accent : {})} />
          ))}
          <line x1="28" x2="28" y1="16" y2="80" opacity="0.5" />
        </g>
      );
    case "wave":
      return (
        <g opacity="0.75">
          {[34, 50, 66].map((y, i) => (
            <path key={y} d={`M0 ${y} C 26 ${y - 12}, 54 ${y + 12}, 80 ${y} S 134 ${y - 12}, 160 ${y}`} {...(i === 1 ? accent : {})} />
          ))}
        </g>
      );
    case "steps":
      return (
        <g opacity="0.7">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={30 + i * 26} y={70 - i * 14} width="22" height={14 + i * 14} rx="2" {...(i === 3 ? accent : {})} />
          ))}
        </g>
      );
    case "dots":
      return (
        <g>
          {Array.from({ length: 7 * 4 }, (_, n) => {
            const x = 32 + (n % 7) * 16;
            const y = 26 + Math.floor(n / 7) * 16;
            const on = n === 10;
            return <circle key={n} cx={x} cy={y} r={on ? 3 : 1.6} fill={on ? "var(--accent)" : "currentColor"} stroke="none" opacity={on ? 1 : 0.55} />;
          })}
        </g>
      );
    case "grid":
      return (
        <g opacity="0.7">
          {[0, 1, 2, 3, 4].map((i) => {
            const h = 30 - i * 5;
            return <rect key={i} x={26 + i * 22} y={78 - h} width="16" height={h} rx="1.5" {...(i === 0 ? accent : {})} />;
          })}
          <line x1="20" x2="140" y1="82" y2="82" opacity="0.5" />
        </g>
      );
    case "arcs":
      return (
        <g opacity="0.7">
          {[14, 26, 38, 50].map((r, i) => (
            <path key={r} d={`M ${80 - r} 84 A ${r} ${r} 0 0 1 ${80 + r} 84`} {...(i === 1 ? accent : {})} />
          ))}
        </g>
      );
  }
}
