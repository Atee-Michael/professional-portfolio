import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { sanitizeArray, sanitizeText } from "@/lib/sanitize";
import { keyFromRequest, rateLimit } from "@/lib/rateLimit";

const dataPath = path.join(process.cwd(), "src/data/tools.json");

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
    const arr = sanitizeArray(body.tools, 50);
    write(arr); return res.status(201).json({ ok: true });
  }
  if (req.method === "PUT") {
    const body = req.body || {};
    const arr = sanitizeArray(body.tools, 50);
    write(arr); return res.json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
}

