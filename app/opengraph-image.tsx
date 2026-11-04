import { ImageResponse } from "next/og";
import { site } from "@/data/content";

export const alt = `${site.name} · ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Loads Newsreader from Google Fonts; falls back to the default font offline. */
async function loadSerif(text: string) {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@72,500&text=${encodeURIComponent(text)}`)
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const title = `${site.name}.`;
  const serif = await loadSerif(title + site.role);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background: "#F7F6F2",
          color: "#1C1B19",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 4, color: "#6E6A62" }}>
          <div style={{ width: 48, height: 2, background: "#1F4E79" }} />
          PORTFOLIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 128, lineHeight: 1, letterSpacing: -3, fontFamily: serif ? "Newsreader" : undefined, display: "flex" }}>
            {site.name}
            <span style={{ color: "#1F4E79" }}>.</span>
          </div>
          <div style={{ fontSize: 44, marginTop: 24, color: "#6E6A62", fontFamily: serif ? "Newsreader" : undefined, fontStyle: "italic" }}>
            {site.role}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#6E6A62", borderTop: "2px solid #E2DFD6", paddingTop: 28 }}>
          {site.intro}
        </div>
      </div>
    ),
    { ...size, fonts: serif ? [{ name: "Newsreader", data: serif, weight: 500, style: "normal" }] : undefined },
  );
}
