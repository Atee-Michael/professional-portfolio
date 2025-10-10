import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { sanitizeText } from "@/lib/sanitize";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

type Payload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
};

function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

async function pushLogSnag(detail: any) {
  const token = process.env.LOGSNAG_TOKEN;
  const project = process.env.LOGSNAG_PROJECT || "portfolio";
  const channel = process.env.LOGSNAG_CHANNEL || "contact";
  if (!token) return;
  try {
    await fetch("https://api.logsnag.com/v1/log", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project,
        channel,
        event: "Contact Submission",
        description: `${detail.name || "Unknown"} <${detail.email || "no-email"}>: ${detail.subject || "No subject"}`.slice(0, 256),
        tags: {
          email: detail.email || "",
        },
        notify: true,
      }),
    } as any);
  } catch {
    // swallow errors to avoid affecting response
  }
}

function appendLocalLog(line: any) {
  try {
    const logPath = path.join(process.cwd(), "src/data/contact.log");
    const payload = JSON.stringify(line) + "\n";
    fs.appendFileSync(logPath, payload);
  } catch {
    // ignore
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = keyFromRequest(req);
  const rl = rateLimit(key, 5, 10 * 60_000); // 5 requests / 10 minutes per IP per route
  if (!rl.allowed) return res.status(429).json({ error: "Too many requests" });

  try {
    const body: Payload = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

    // Honeypot check
    if (body.website) return res.status(400).json({ error: "Invalid submission" });

    // Server-side validation with sanitization
    const name = sanitizeText(body.name, 80);
    const email = (body.email || "").toString().trim();
    const subject = sanitizeText(body.subject || "Portfolio Contact", 120);
    const message = sanitizeText(body.message, 2000);

    if (!name || !email || !message) return res.status(400).json({ error: "Missing required fields" });
    if (!validateEmail(email)) return res.status(400).json({ error: "Invalid email" });

    // Compose email
    const to = process.env.CONTACT_TO || "ateemichael@yahoo.com";
    const fromUser = process.env.GMAIL_USER || process.env.SMTP_USER || "";
    const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "";
    const dryRun = String(process.env.CONTACT_DRY_RUN || "false") === "true";
    if (!fromUser || !pass) {
      if (dryRun) {
        const logLine = { ts: new Date().toISOString(), ip: key.split(":")[0], name, email, subject, note: "dry_run" };
        appendLocalLog({ ...logLine, ok: true });
        pushLogSnag(logLine);
        return res.json({ ok: true, dryRun: true });
      }
      return res.status(500).json({ error: "Email service not configured" });
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const explicitPort = process.env.SMTP_PORT;
    const tlsInsecure = String(process.env.SMTP_TLS_INSECURE || "false") === "true";
    const baseConfig = {
      host,
      port: Number(explicitPort || 465),
      secure: String(process.env.SMTP_SECURE || (explicitPort ? "false" : "true")) === "true",
      auth: { user: fromUser, pass },
      tls: tlsInsecure ? { rejectUnauthorized: false } : { servername: host },
    } as const;

    const sendWith = async (cfg: any) => {
      const transporter = nodemailer.createTransport(cfg);
      return transporter.sendMail({
        from: fromUser,
        to,
        subject: `[Portfolio] ${subject}`,
        text,
        html,
        replyTo: email,
      });
    };

    const text = [
      `From: ${name} <${email}>`,
      `Subject: ${subject}`,
      "",
      message,
    ].join("\n");

    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;color:#111">
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <pre style="white-space:pre-wrap">${message}</pre>
      </div>
    `;

    try {
      await sendWith(baseConfig);
    } catch (e: any) {
      // If using default Gmail settings and no explicit port provided, retry with 587 STARTTLS
      const primaryCode = e?.code || e?.responseCode || "UNKNOWN";
      const shouldRetry = !explicitPort && host === "smtp.gmail.com";
      if (shouldRetry) {
        try {
          await sendWith({
            ...baseConfig,
            port: 587,
            secure: false,
            tls: tlsInsecure ? { rejectUnauthorized: false } : { ciphers: "TLSv1.2", rejectUnauthorized: true, servername: host },
          });
        } catch (e2: any) {
          const code2 = e2?.code || e2?.responseCode || "UNKNOWN";
          appendLocalLog({ ts: new Date().toISOString(), err: "sendMail failed (retry)", code: code2, msg: e2?.message || String(e2) });
          if (dryRun) {
            const logLine = { ts: new Date().toISOString(), ip: key.split(":")[0], name, email, subject, note: "dry_run_after_retry" };
            appendLocalLog({ ...logLine, ok: true });
            pushLogSnag(logLine);
            return res.json({ ok: true, dryRun: true });
          }
          return res.status(502).json({ error: "Email delivery failed" });
        }
      } else {
        appendLocalLog({ ts: new Date().toISOString(), err: "sendMail failed", code: primaryCode, msg: e?.message || String(e) });
        if (dryRun) {
          const logLine = { ts: new Date().toISOString(), ip: key.split(":")[0], name, email, subject, note: "dry_run_primary" };
          appendLocalLog({ ...logLine, ok: true });
          pushLogSnag(logLine);
          return res.json({ ok: true, dryRun: true });
        }
        return res.status(502).json({ error: "Email delivery failed" });
      }
    }

    const logLine = { ts: new Date().toISOString(), ip: key.split(":")[0], name, email, subject };
    appendLocalLog({ ...logLine, ok: true });
    pushLogSnag(logLine); // fire and forget

    return res.json({ ok: true });
  } catch (e: any) {
    appendLocalLog({ ts: new Date().toISOString(), err: e?.message || String(e) });
    return res.status(500).json({ error: "Server error" });
  }
}
