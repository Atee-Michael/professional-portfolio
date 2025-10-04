import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import fs from "fs";
import path from "path";
import { assertPdfBuffer } from "@/lib/sanitize";

export const config = {
  api: {
    bodyParser: { sizeLimit: "10mb" },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions as any);
  if (!(session?.user && (session.user as any).isAdmin)) return res.status(403).json({ error: "Forbidden" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { fileBase64, filename } = req.body || {};
  if (!fileBase64 || !filename) return res.status(400).json({ error: "fileBase64 and filename required" });
  const safeName = filename.replace(/[^a-z0-9._-]/gi, "_").replace(/\.pdf$/i, "") + ".pdf";
  const buf = Buffer.from(fileBase64.split(",").pop() || "", "base64");
  try {
    assertPdfBuffer(buf);
  } catch (e: any) { return res.status(400).json({ error: e.message }); }
  const docsDir = path.join(process.cwd(), "public/docs");
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  const filePath = path.join(docsDir, safeName);
  fs.writeFileSync(filePath, buf);
  return res.json({ ok: true, docPath: `/docs/${safeName}` });
}

