import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD
  summary: string;
  readingTime: number; // minutes
};

function readingTime(text: string) {
  const words = text.replace(/```[\s\S]*?```/g, "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

function readFile(slug: string) {
  const file = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const meta: PostMeta = {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date),
    summary: String(data.summary ?? ""),
    readingTime: readingTime(content),
  };
  return { meta, content };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => readFile(f.replace(/\.mdx$/, ""))!.meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string) {
  const file = readFile(slug);
  if (!file) return null;
  const { default: Content } = await evaluate(file.content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        { theme: { light: "github-light", dark: "github-dark-dimmed" }, keepBackground: false },
      ],
    ],
  });
  return { meta: file.meta, Content };
}

export function formatDate(date: string, style: "short" | "long" = "long") {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: style === "long" ? "numeric" : undefined,
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}
