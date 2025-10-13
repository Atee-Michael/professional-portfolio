import type { NextApiRequest } from "next";

type Key = string;

const buckets = new Map<Key, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 30, windowMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  if (b.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count += 1;
  return { allowed: true, remaining: limit - b.count };
}

export function keyFromRequest(req: Pick<NextApiRequest, "headers" | "socket" | "url">) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded) || req.socket?.remoteAddress || "unknown";
  const route = req.url?.split("?")[0] || "";
  return `${String(ip)}:${route}`;
}

