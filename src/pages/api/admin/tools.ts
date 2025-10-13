import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { sanitizeArray, sanitizeText } from "@/lib/sanitize";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";
import type { Session } from "next-auth";

const dataPath = path.join(process.cwd(), "src/data/tools.json");
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
  const read = (): string[] => JSON.parse(fs.readFileSync(dataPath, "utf8")) as string[];
  const write = (d: string[]) => fs.writeFileSync(dataPath, JSON.stringify(d, null, 2));

  if (req.method === "GET") return res.json(read());
  if (req.method === "POST") {
    const body = req.body || {};
    const arr = sanitizeArray(body.tools, 50);
    write(arr);
    log(session, "tools_create", { count: arr.length });
    return res.status(201).json({ ok: true });
  }
  if (req.method === "PUT") {
    const body = req.body || {};
    const arr = sanitizeArray(body.tools, 50);
    write(arr);
    log(session, "tools_update", { count: arr.length });
    return res.json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}
