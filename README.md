# Masood PK — portfolio

A quiet, text-first developer portfolio. Next.js (App Router), TypeScript, Tailwind CSS v4, MDX.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

Deploy: push to GitHub and import the repo on Vercel. No settings needed.

## Edit your content

| What | Where |
| --- | --- |
| Name, role, links, email, about, experience, projects | `data/content.ts` |
| Blog posts | `content/posts/*.mdx` (frontmatter: `title`, `date`, `summary`) |
| Résumé | replace `public/resume.pdf` |
| Project screenshots (optional) | put images in `public/projects/` and set `image: "/projects/x.png"` |
| Colours | CSS variables at the top of `app/globals.css` |
| Site URL for SEO | `site.url` in `data/content.ts` |

In `about` and other text, `[label](url)` makes an accent link and `*phrase*` makes an accent-coloured phrase.

To try a different accent: forest `#2F5D50` or oxblood `#7A2E2E` (light), and a lighter tint of it for dark mode.

## Details

- **Hero background (`components/Shards.tsx`):** empty until you move over it; the cursor then sprays colourful shards that spin and dissolve (a tap bursts a ring). Plain canvas, no libraries; the animation loop only runs while shards are visible. Colours live in `PALETTES` at the top of the file.
- **Keyboard role (`components/Keycaps.tsx`):** `site.role` rendered as 3D keycaps. Click a key or type its letter to press it. Sounds: `public/keys-asmr.m4a` (25 KB, per-key press/release clips from the "ASMR Programming" Mechvibes pack by luv.sora, licensed *personal use only*) or `public/keys.m4a` (12 KB, cut from a typing recording). Pick one with `PACK` in `lib/keySound.ts`; volume is `out.gain.value`.
- **Contact form (`components/ContactForm.tsx` → `app/api/contact/route.ts`):** the form posts to the API route, which emails you through [Resend](https://resend.com) with Reply-To set to the visitor. Create a free Resend account with the inbox you want messages in, copy `.env.example` to `.env.local` and set `RESEND_API_KEY` (on Vercel: Project → Settings → Environment Variables). A hidden honeypot field drops bot submissions.
- **Command menu:** press `/` or `⌘K` / `Ctrl+K`.
- **Spotlight:** a 4% accent light follows the cursor (mouse devices only, off with reduced motion).
- **Sidebar:** `site.statement` and `site.summary`; toggle `site.available` for the green "Available" dot.
- **Load animation:** one CSS fade-up with stagger, so it runs before JavaScript loads. Framer Motion is used only for the command menu and toast.
- **SEO:** metadata, generated Open Graph image (`app/opengraph-image.tsx`), `sitemap.xml`, `robots.txt`, SVG favicon.

## Structure

```
app/            pages: /, /projects, /blog, /blog/[slug], 404, OG image, sitemap, robots
components/     Sidebar, Nav, Section, ExperienceItem, ProjectItem, Thumbnail,
                ThemeToggle, CommandMenu, Spotlight, Shards, Toaster, …
data/content.ts all site content
lib/posts.ts    MDX loading, Shiki highlighting, reading time
content/posts/  your writing
```
