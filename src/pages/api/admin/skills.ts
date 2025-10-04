import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { sanitizeText, sanitizeArray } from "@/lib/sanitize";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

const dataPath = path.join(process.cwd(), "src/data/skills.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!(session?.user && (session.user as any).isAdmin)) return res.status(403).json({ error: "Forbidden" });
  const rl = rateLimit(keyFromRequest(req), 60, 60_000);
  if (!rl.allowed) return res.status(429).json({ error: "Too many requests" });
  const read = () => JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const write = (d: any) => fs.writeFileSync(dataPath, JSON.stringify(d, null, 2));

  if (req.method === "GET") return res.json(read());
  if (req.method === "POST") {
    const body = req.body || {};
    const cat = {
      title: sanitizeText(body.title, 64),
      color: sanitizeText(body.color, 16) || undefined,
      items: (Array.isArray(body.items) ? body.items : []).slice(0, 12).map((it: any) => ({
        name: sanitizeText(it?.name, 64),
        percent: Math.max(0, Math.min(100, Number(it?.percent) || 0)),
      })),
    };
    const data = read();
    data.push(cat); write(data); return res.status(201).json({ ok: true });
  }
  if (req.method === "PUT") {
    const idx = Number(req.query.index); const data = read();
    if (!Number.isInteger(idx) || idx < 0 || idx >= data.length) return res.status(404).json({ error: "not found" });
    const body = req.body || {};
    const cat = data[idx];
    cat.title = sanitizeText(body.title ?? cat.title, 64);
    cat.color = sanitizeText(body.color ?? cat.color, 16) || undefined;
    if (body.items) cat.items = (Array.isArray(body.items) ? body.items : []).slice(0, 12).map((it: any) => ({ name: sanitizeText(it?.name, 64), percent: Math.max(0, Math.min(100, Number(it?.percent) || 0)) }));
    write(data); return res.json({ ok: true });
  }
  if (req.method === "DELETE") {
    const idx = Number(req.query.index); const data = read();
    if (!Number.isInteger(idx) || idx < 0 || idx >= data.length) return res.status(404).json({ error: "not found" });
    data.splice(idx, 1); write(data); return res.json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}

