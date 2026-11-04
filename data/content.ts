/**
 * All site content lives here. Edit this file — no need to touch components.
 *
 * Inline links in text fields use markdown syntax: [label](https://url)
 * Wrap a phrase in *asterisks* to set it in the accent colour without a link.
 */

export const site = {
  name: "Masood PK",
  role: "Software Developer",
  intro: "I build fast, reliable web applications with clean code and careful design.", // used for SEO
  // Shown large at the top of the sidebar. *phrase* is set in accent italics.
  statement: "Fast, reliable web applications, built with *clean code* and *careful design*.",
  summary: "Selected experience and projects, 2024 to today.",
  url: "https://masoodpk.dev", // used for SEO, sitemap and Open Graph
  email: "masoodpk555@gmail.com",
  available: true, // shows the green "Available for work" dot
  resume: "/resume.pdf",
  photo: "/me.png", // your portrait in /public
  links: {
    github: "https://github.com/masoodpk",
    linkedin: "https://www.linkedin.com/in/masood-pk-076bb4297",
  },
};

export const about: string[] = [
  "I'm a frontend-focused software developer with two years of experience building production web applications. I specialise in component-driven interfaces with *React*, *Vue* and *TypeScript*, with a focus on performance, accessibility and consistent behaviour across devices.",
  "Beyond the frontend, I've built full-stack projects on the *MERN stack*, giving me hands-on experience with Node.js, Express and MongoDB. That backend understanding helps me design interfaces that integrate cleanly with APIs, and work effectively alongside backend, product and design teams.",
  "I value clean, well-documented code and thoughtful code reviews, and I'm open to roles where I can contribute across the stack while continuing to grow as an engineer.",
];

/** A short "now" line shown under About. Set to "" to hide. */
export const now = "Software Developer at IOCOD Infotech, building Easify · Kozhikode, Kerala";

export type Experience = {
  start: string;
  end: string;
  role: string;
  company: string;
  location: string;
  url?: string;
  description: string;
  tags: string[];
};

export const experience: Experience[] = [
  {
    start: "Jan\u00a02025",
    end: "Present",
    role: "Software Developer",
    company: "IOCOD Infotech",
    location: "Kozhikode, India",
    description:
      "Deliver customer-facing features for Easify, a business communications platform for messaging, campaigns and contact management. Build reusable, responsive dashboard and messaging components, integrate them with REST APIs alongside backend, product and design teams, and drive UI fixes and performance improvements in every release.",
    tags: ["Vue.js", "Nuxt.js", "TypeScript", "REST APIs"],
  },
  {
    start: "Sep\u00a02024",
    end: "Dec\u00a02024",
    role: "Web Developer Trainee",
    company: "Skepper Creative Agency",
    location: "Bangalore, India",
    description:
      "Built a dynamic React.js web application with responsive layouts and interactive components, and developed landing pages in HTML5 and CSS3 with a focus on performance and cross-browser compatibility. Integrated front-end work with back-end services as part of a small team.",
    tags: ["React.js", "JavaScript", "HTML5", "CSS3"],
  },
];

/** Tile style for a project thumbnail when no image is given. */
export type Mark = "lines" | "dots" | "grid" | "arcs" | "steps" | "wave";

export type Project = {
  title: string;
  year: number;
  description: string;
  url?: string; // live site
  repo?: string; // source code
  tags: string[];
  stat?: string; // e.g. "1.2k ★" or "800 users"
  image?: string; // optional path in /public, e.g. "/projects/ledger.png"
  mark?: Mark;
  madeAt?: string;
  featured?: boolean; // featured projects appear on the home page
};

export const projects: Project[] = [
  {
    title: "Easify",
    year: 2025,
    description:
      "Business communication platform for bulk SMS, calling, ringless voicemail and email outreach. Built responsive dashboards and campaign-management UI, integrated with REST APIs.",
    url: "https://easify.app/",
    image: "/projects/easify.webp",
    tags: ["Vue.js", "Nuxt.js", "REST APIs"],
    mark: "dots",
    madeAt: "IOCOD Infotech",
    featured: true,
  },
  {
    title: "Brewyourbrand",
    year: 2024,
    description:
      "Live marketing website with interactive components and responsive layouts, built for performance, accessibility and cross-browser compatibility.",
    url: "https://brewyourbrand.in/",
    image: "/projects/brewyourbrand.webp",
    madeAt: "Skepper Creative Agency",
    tags: ["React.js", "HTML", "CSS"],
    mark: "wave",
    featured: true,
  },
];

/** Home page sections. Add { id: "writing", label: "Writing" } back once you publish posts in content/posts. */
export const nav = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
] as const;
