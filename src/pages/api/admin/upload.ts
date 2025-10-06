import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import formidable from "formidable";
import { assertPdfBuffer } from "@/lib/sanitize";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";
const logPath = require("path").join(process.cwd(), "src/data/admin-log.jsonl");
function log(session: any, action: string, detail?: any) {
  const fs = require("fs");
  const line = JSON.stringify({ ts: new Date().toISOString(), user: session?.user?.email || "unknown", action, detail }) + "\n";
  fs.appendFileSync(logPath, line);
}

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!(session?.user && (session.user as any).isAdmin)) return res.status(403).json({ error: "Forbidden" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const rl = rateLimit(keyFromRequest(req), 20, 60_000);
  if (!rl.allowed) return res.status(429).json({ error: "Too many uploads" });

  const form = formidable({ multiples: false, maxFileSize: 10 * 1024 * 1024 });
  const { fields, files }: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });
  const f = files?.file as formidable.File | undefined;
  if (!f) return res.status(400).json({ error: "file field required" });
  const ext = path.extname(f.originalFilename || "").toLowerCase();
  if (ext !== ".pdf") return res.status(400).json({ error: "PDF only" });
  const buf = fs.readFileSync(f.filepath);
  try { assertPdfBuffer(buf); } catch (e: any) { return res.status(400).json({ error: e.message }); }
  const safeBase = (f.originalFilename || "document.pdf").replace(/[^a-z0-9._-]/gi, "_").replace(/\.pdf$/i, "");
  const safeName = `${safeBase}-${Date.now()}.pdf`;
  const docsDir = path.join(process.cwd(), "public/docs");
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, safeName), buf);
  log(session, "upload_pdf", { file: safeName, size: buf.length });
  return res.json({ ok: true, docPath: `/docs/${safeName}` });
}
