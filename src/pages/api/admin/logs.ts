import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

const logPath = path.join(process.cwd(), "src/data/admin-log.jsonl");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = Boolean((session?.user as { isAdmin?: boolean } | undefined)?.isAdmin);
  if (!isAdmin) return res.status(403).json({ error: "Forbidden" });

  const rl = rateLimit(keyFromRequest(req), 60, 60_000);
  if (!rl.allowed) return res.status(429).json({ error: "Too many requests" });

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const limit = Math.max(1, Math.min(1000, Number(req.query.limit) || 200));
  if (!fs.existsSync(logPath)) return res.json([]);
  try {
    const raw = fs.readFileSync(logPath, "utf8");
    const lines = raw.trim().split(/\r?\n/).filter(Boolean);
    const slice = lines.slice(-limit);
    const entries = slice.map((line) => {
      try { return JSON.parse(line); } catch { return { ts: null, user: null, action: "parse_error", raw: line }; }
    }).reverse(); // newest first
    return res.json(entries);
  } catch (e: unknown) {
    const msg = typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : "Failed to read logs";
    return res.status(500).json({ error: msg });
  }
}

