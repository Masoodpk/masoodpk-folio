import { site } from "@/data/content";
import Nav from "./Nav";
import RichText from "./RichText";
import Socials from "./Socials";

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Left column. The hero already shows name and role, so this opens with a statement. */
export default function Sidebar() {
  return (
    <header className="pt-14 pb-4 lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-[44%] lg:flex-col lg:justify-between lg:py-24">
      <div>
        <p className="rise label flex items-center gap-4 text-muted" style={stagger(0)}>
          <span>
            <span className="text-accent">/</span> index
          </span>
          {site.available && (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/15" />
              Available for work
            </span>
          )}
        </p>

        <p
          className="rise mt-8 max-w-[24rem] font-serif text-[2rem] leading-[1.18] font-normal tracking-[-0.015em] text-balance text-text sm:text-[2.4rem]"
          style={stagger(1)}
        >
          <RichText text={site.statement} emphasis="italic text-accent" />
        </p>

        <div className="rise mt-7 flex items-center gap-4" style={stagger(2)}>
          <span aria-hidden="true" className="h-px w-8 bg-accent" />
          <p className="text-[0.95rem] text-muted">{site.summary}</p>
        </div>

        <div className="rise" style={stagger(3)}>
          <Nav />
        </div>
      </div>

      <div className="rise mt-10 lg:mt-0" style={stagger(4)}>
        <Socials />
      </div>
    </header>
  );
}
