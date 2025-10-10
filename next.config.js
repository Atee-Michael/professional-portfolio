/**
 * Security headers configuration
 * - CSP defaults to 'self' with minimal allowances; dev adds relaxed bits for Next/React tooling
 * - HSTS enabled (effective only over HTTPS / behind a proxy like Cloudflare)
 * - X-Frame-Options, Referrer-Policy, Permissions-Policy as requested
 */

const isDev = process.env.NODE_ENV !== "production";

// Content Security Policy
// Keep tight by default; allow inline/eval only in development to avoid breaking Next dev tools
const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  // Scripts: in dev allow inline/eval for HMR; in prod keep to 'self' (plus blob for some runtimes)
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:"
    : "script-src 'self' blob:",
  "script-src-attr 'none'",
  // Styles: allow inline for AntD/Next style tags
  "style-src 'self' 'unsafe-inline'",
  // Connections (API, SSG fetch, Next HMR in dev)
  isDev ? "connect-src 'self' ws: https:" : "connect-src 'self' https:",
  // Images/fonts can be loaded from self + data/blob URIs
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // Disallow risky defaults
  "object-src 'none'",
  // Upgrade any http content (only effective over https)
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  // Tight Permissions-Policy — opt-out of sensitive features by default
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), ambient-light-sensor=(), gyroscope=(), magnetometer=(), accelerometer=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;

