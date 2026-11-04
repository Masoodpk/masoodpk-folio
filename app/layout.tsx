import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { site } from "@/data/content";
import Spotlight from "@/components/Spotlight";
import CommandMenu from "@/components/CommandMenu";
import Toaster from "@/components/Toaster";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.role}`, template: `%s · ${site.name}` },
  description: site.intro,
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} · ${site.role}`,
    description: site.intro,
  },
  twitter: { card: "summary_large_image", title: `${site.name} · ${site.role}`, description: site.intro },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F6F2" },
    { media: "(prefers-color-scheme: dark)", color: "#111315" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <a
            href="#content"
            className="label fixed left-4 top-4 z-50 -translate-y-20 rounded-md bg-accent px-4 py-3 text-bg transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Spotlight />
          <div className="relative z-10">{children}</div>
          <CommandMenu />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
