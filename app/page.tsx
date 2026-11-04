import Link from "next/link";
import { about, experience, now, projects, site } from "@/data/content";
import { formatDate, getAllPosts } from "@/lib/posts";
import Hero from "@/components/Hero";
import Sidebar from "@/components/Sidebar";
import Section from "@/components/Section";
import ExperienceItem from "@/components/ExperienceItem";
import ProjectItem from "@/components/ProjectItem";
import RichText from "@/components/RichText";
import ArrowLink from "@/components/ArrowLink";
import Footer from "@/components/Footer";

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      <Hero />
      <div className="mx-auto min-h-screen max-w-[1100px] px-6 sm:px-10 lg:flex lg:justify-between lg:gap-8 lg:px-12">
        <Sidebar />

        <main id="content" tabIndex={-1} className="pt-16 outline-none lg:w-[52%] lg:py-24">
          <Section id="about" index={1} label="About" style={stagger(3)}>
            <div className="space-y-5 text-text/90">
              {about.map((p, i) => (
                <p key={i}>
                  <RichText text={p} />
                </p>
              ))}
            </div>
            {now && (
              <p className="mt-8 flex gap-3 border-l-2 border-accent pl-4 text-[0.95rem] text-muted">
                <span className="label pt-1 text-accent">Now</span>
                <span>{now}</span>
              </p>
            )}
          </Section>

          <Section id="experience" index={2} label="Experience" style={stagger(4)}>
            <ol className="dim-list space-y-12">
              {experience.map((item) => (
                <li key={`${item.company}-${item.start}`}>
                  <ExperienceItem item={item} />
                </li>
              ))}
            </ol>
            <ArrowLink href={site.resume} external>
              View full résumé
            </ArrowLink>
          </Section>

          <Section id="projects" index={3} label="Projects" style={stagger(5)}>
            <ul className="dim-list space-y-12">
              {featured.map((project) => (
                <li key={project.title}>
                  <ProjectItem project={project} />
                </li>
              ))}
            </ul>
            <ArrowLink href="/projects">View all projects</ArrowLink>
          </Section>

          {posts.length > 0 && (
            <Section id="writing" index={4} label="Writing" style={stagger(6)}>
              <ul className="dim-list -mx-4">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group grid gap-1 rounded-lg px-4 py-4 transition-colors sm:grid-cols-[7.5rem_1fr] sm:gap-6 lg:hover:bg-surface"
                    >
                      <time dateTime={post.date} className="label pt-1.5 text-muted">
                        {formatDate(post.date, "short")}
                      </time>
                      <span>
                        <span className="font-medium text-text transition-colors group-hover:text-accent">{post.title}</span>
                        <span className="label ml-3 whitespace-nowrap text-muted">{post.readingTime} min</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ArrowLink href="/blog">All writing</ArrowLink>
            </Section>
          )}

          <Footer />
        </main>
      </div>
    </>
  );
}
