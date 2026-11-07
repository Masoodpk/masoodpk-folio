import { site } from "@/data/content";

/**
 * Contact form endpoint. The browser can't send email itself, so the form
 * POSTs here and this sends it on through Resend (https://resend.com).
 *
 * Env (see .env.example):
 *   RESEND_API_KEY  required
 *   CONTACT_TO      inbox that receives messages (defaults to site.email)
 *   CONTACT_FROM    sender; "onboarding@resend.dev" works without a domain,
 *                   but then Resend only delivers to your own account email
 */

const LIMITS = { name: 100, email: 200, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const fail = (error: string, status = 400) => Response.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Invalid request.");
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);

  // Honeypot: real visitors never see this field, bots fill it. Pretend it worked.
  if (str(body.company)) return Response.json({ ok: true });

  if (!name || name.length > LIMITS.name) return fail("Please add your name.");
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) return fail("That email doesn't look right.");
  if (message.length < 2 || message.length > LIMITS.message) return fail("Please write a message (up to 5000 characters).");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return fail("The contact form isn't set up yet.", 503);
  }

  const to = process.env.CONTACT_TO || site.email;
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email, // hit Reply in your inbox to answer them directly
      subject: `Portfolio: message from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
      html: `<p style="white-space:pre-wrap;font:15px/1.6 system-ui,sans-serif">${escape(message)}</p>
<p style="color:#6e6a62;font:13px system-ui,sans-serif">— ${escape(name)} &lt;${escape(email)}&gt;</p>`,
    }),
  });

  if (!res.ok) {
    console.error("[contact] Resend error", res.status, await res.text());
    return fail("Couldn't send right now.", 502);
  }

  return Response.json({ ok: true });
}
