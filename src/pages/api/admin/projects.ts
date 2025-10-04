import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { sanitizeText, sanitizeArray } from "@/lib/sanitize";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

const dataPath = path.join(process.cwd(), "src/data/projects.json");
const logPath = path.join(process.cwd(), "src/data/admin-log.jsonl");

function requireAdmin(session: any) {
  const isAdmin = Boolean(session?.user && (session.user as any).isAdmin);
  if (!isAdmin) {
    const err: any = new Error("Forbidden");
    err.status = 403; throw err;
  }
}

function readProjects() {
  const raw = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(raw);
}
function writeProjects(projects: any) {
  fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
}
function log(session: any, action: string, detail?: any) {
  const line = JSON.stringify({ ts: new Date().toISOString(), user: session?.user?.email || "unknown", action, detail }) + "\n";
  fs.appendFileSync(logPath, line);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  const key = keyFromRequest(req);
  const rl = rateLimit(key, 60, 60_000); // 60 req/min per IP per route
  if (!rl.allowed) return res.status(429).json({ error: "Too many requests" });
  try {
    if (req.method === "GET") {
      requireAdmin(session);
      const data = readProjects();
      return res.json(data);
    }
    if (req.method === "POST") {
      requireAdmin(session);
      const body = req.body || {};
      const item = {
        title: sanitizeText(body.title, 120),
        description: sanitizeText(body.description, 600),
        stack: sanitizeArray(body.stack, 10),
        repoLink: sanitizeText(body.repoLink, 300) || undefined,
        liveLink: sanitizeText(body.liveLink, 300) || undefined,
        docPath: sanitizeText(body.docPath, 200),
        categories: sanitizeArray(body.categories, 8),
      };
      const projects = readProjects();
      projects.unshift(item);
      writeProjects(projects);
      log(session, "create", { title: item.title });
      return res.status(201).json({ ok: true });
    }
    if (req.method === "PUT") {
      requireAdmin(session);
      const body = req.body || {};
      const idx = Number(req.query.index);
      if (!Number.isInteger(idx)) return res.status(400).json({ error: "index required" });
      const projects = readProjects();
      if (idx < 0 || idx >= projects.length) return res.status(404).json({ error: "not found" });
      const current = projects[idx];
      const updated = {
        ...current,
        title: sanitizeText(body.title ?? current.title, 120),
        description: sanitizeText(body.description ?? current.description, 600),
        stack: body.stack ? sanitizeArray(body.stack, 10) : current.stack,
        repoLink: sanitizeText(body.repoLink ?? current.repoLink, 300) || undefined,
        liveLink: sanitizeText(body.liveLink ?? current.liveLink, 300) || undefined,
        docPath: sanitizeText(body.docPath ?? current.docPath, 200),
        categories: body.categories ? sanitizeArray(body.categories, 8) : current.categories,
      };
      projects[idx] = updated;
      writeProjects(projects);
      log(session, "update", { title: updated.title });
      return res.json({ ok: true });
    }
    if (req.method === "DELETE") {
      requireAdmin(session);
      const idx = Number(req.query.index);
      const projects = readProjects();
      if (!Number.isInteger(idx) || idx < 0 || idx >= projects.length) return res.status(404).json({ error: "not found" });
      const removed = projects.splice(idx, 1);
      writeProjects(projects);
      log(session, "delete", { title: removed[0]?.title });
      return res.json({ ok: true });
    }
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    return res.status(e.status || 500).json({ error: e.message || "Server error" });
  }
}
