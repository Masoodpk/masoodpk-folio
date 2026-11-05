import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { site } from "@/data/content";
import Spotlight from "@/components/Spotlight";
import CommandMenu from "@/components/CommandMenu";
import Loader from "@/components/Loader";
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

/**
 * Runs before first paint: skip the loading screen if it was already shown in
 * this tab or the visitor prefers reduced motion; otherwise hold the page's
 * entrance animation until it lifts (with a 6s safety net).
 */
const loaderScript = `(function(){try{var d=document.documentElement;if(sessionStorage.getItem("folio:loaded")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("no-loader")}else{d.classList.add("is-loading");setTimeout(function(){d.classList.remove("is-loading")},6000)}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Loader />
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
