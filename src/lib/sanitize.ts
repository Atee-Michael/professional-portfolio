export function sanitizeText(input: unknown, max = 500): string {
  return (input ?? "")
    .toString()
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/%0a|%0d|\r|\n/gi, " ")
    .replace(/[<>]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, max);
}

export function sanitizeArray(input: unknown, maxItems = 10): string[] {
  const arr = Array.isArray(input) ? input : [];
  return arr.slice(0, maxItems).map((s) => sanitizeText(s, 64));
}

export function assertPdfBuffer(buf: Buffer): void {
  // minimal check: starts with %PDF and not huge
  if (buf.length === 0 || buf.length > 10 * 1024 * 1024) throw new Error("Invalid PDF size");
  const head = buf.subarray(0, 4).toString("utf8");
  if (!head.startsWith("%PDF")) throw new Error("Not a PDF");
}

export type AdminLog = {
  ts: string;
  user: string;
  action: string;
  detail?: any;
};

