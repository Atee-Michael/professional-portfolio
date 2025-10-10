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
    if (!fromUser || !pass) {
      return res.status(500).json({ error: "Email service not configured" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: { user: fromUser, pass },
    });

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

    await transporter.sendMail({
      from: fromUser,
      to,
      subject: `[Portfolio] ${subject}`,
      text,
      html,
      replyTo: email,
    });

    const logLine = { ts: new Date().toISOString(), ip: key.split(":")[0], name, email, subject };
    appendLocalLog({ ...logLine, ok: true });
    pushLogSnag(logLine); // fire and forget

    return res.json({ ok: true });
  } catch (e: any) {
    appendLocalLog({ ts: new Date().toISOString(), err: e?.message || String(e) });
    return res.status(500).json({ error: "Server error" });
  }
}

