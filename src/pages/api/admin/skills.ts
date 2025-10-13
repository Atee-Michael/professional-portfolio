import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { sanitizeText, sanitizeArray } from "@/lib/sanitize";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";
import type { Session } from "next-auth";

const dataPath = path.join(process.cwd(), "src/data/skills.json");
const logPath = path.join(process.cwd(), "src/data/admin-log.jsonl");
function log(session: Session | null, action: string, detail?: unknown) {
  const line = JSON.stringify({ ts: new Date().toISOString(), user: session?.user?.email || "unknown", action, detail }) + "\n";
  fs.appendFileSync(logPath, line);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = Boolean((session?.user as { isAdmin?: boolean } | undefined)?.isAdmin);
  if (!isAdmin) return res.status(403).json({ error: "Forbidden" });
  const rl = rateLimit(keyFromRequest(req), 60, 60_000);
  if (!rl.allowed) return res.status(429).json({ error: "Too many requests" });
  type SkillItem = { name: string; percent: number };
  type SkillCategory = { title: string; color?: string; items: SkillItem[] };
  const read = (): SkillCategory[] => JSON.parse(fs.readFileSync(dataPath, "utf8")) as SkillCategory[];
  const write = (d: SkillCategory[]) => fs.writeFileSync(dataPath, JSON.stringify(d, null, 2));

  if (req.method === "GET") return res.json(read());
  if (req.method === "POST") {
    const body = req.body || {};
    const cat: SkillCategory = {
      title: sanitizeText(body.title, 64),
      color: sanitizeText(body.color, 16) || undefined,
      items: (Array.isArray(body.items) ? body.items : []).slice(0, 12).map((it: unknown) => {
        const item = it as Partial<SkillItem>;
        return {
          name: sanitizeText(item?.name, 64),
          percent: Math.max(0, Math.min(100, Number(item?.percent) || 0)),
        };
      }),
    };
    const data = read();
    data.push(cat); write(data);
    log(session, "skills_create", { title: cat.title, items: cat.items?.length || 0 });
    return res.status(201).json({ ok: true });
  }
  if (req.method === "PUT") {
    const idx = Number(req.query.index); const data = read();
    if (!Number.isInteger(idx) || idx < 0 || idx >= data.length) return res.status(404).json({ error: "not found" });
    const body = req.body || {};
    const cat = data[idx];
    cat.title = sanitizeText(body.title ?? cat.title, 64);
    cat.color = sanitizeText(body.color ?? cat.color, 16) || undefined;
    if (body.items) cat.items = (Array.isArray(body.items) ? body.items : []).slice(0, 12).map((it: unknown) => {
      const item = it as Partial<SkillItem>;
      return { name: sanitizeText(item?.name, 64), percent: Math.max(0, Math.min(100, Number(item?.percent) || 0)) };
    });
    write(data);
    log(session, "skills_update", { index: idx, title: cat.title, items: cat.items?.length || 0 });
    return res.json({ ok: true });
  }
  if (req.method === "DELETE") {
    const idx = Number(req.query.index); const data = read();
    if (!Number.isInteger(idx) || idx < 0 || idx >= data.length) return res.status(404).json({ error: "not found" });
    const removed = data.splice(idx, 1);
    write(data);
    log(session, "skills_delete", { index: idx, title: removed[0]?.title });
    return res.json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
