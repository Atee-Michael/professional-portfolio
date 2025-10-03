"use client";
import { useEffect, useState } from "react";

type Mode = "light" | "dark";

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize from storage or system preference
  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("theme-mode") as Mode | null) : null;
    const systemDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: Mode = stored ?? (systemDark ? "dark" : "light");
    apply(initial);
    setMode(initial);
    setMounted(true);
  }, []);

  const apply = (m: Mode) => {
    const root = document.documentElement;
    if (m === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme-mode", m);
  };

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    apply(next);
  };

  // Avoid icon flicker before mount
  const icon = mode === "dark" ? (
    // Sun for day, Moon for night (show opposite to indicate action)
    <svg className="icon-sun" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6.76 4.84l-1.8-1.79L4 2l1.79 1.79l.97 1.05zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.96 19.04L3.17 20.83L2 19.66l1.79-1.79l1.17 1.17zM20 13h3v-2h-3v2zM11 1h2v3h-2V1zm7.04 3.96L21.83 2.17L23 3.34l-1.79 1.79l-1.17-1.17zM12 6a6 6 0 1 0 .001 12.001A6 6 0 0 0 12 6zm6.24 13.16l1.8 1.79L22 22l-1.79-1.79l-1.97-1.05z"/>
    </svg>
  ) : (
    <svg className="icon-moon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M21.64 13a9 9 0 1 1-10.64-10.64A9 9 0 0 0 21.64 13z"/>
    </svg>
  );

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      style={{ visibility: mounted ? "visible" : "hidden" }}
    >
      {icon}
    </button>
  );
}

