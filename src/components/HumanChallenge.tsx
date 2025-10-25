"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "antd";

type Props = {
  onSolved: (token: string) => void;
};

export default function HumanChallenge({ onSolved }: Props) {
  // Random glowing notch position each mount
  const [target] = useState(() => Math.floor(10 + Math.random() * 80)); // 10–90
  const [salt] = useState(() => Math.random().toString(36).slice(2));
  const [value, setValue] = useState(0);
  const [solved, setSolved] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState<{left:number; top:number}>({ left: 0, top: 8 });

  const token = useMemo(() => {
    const s = `${target}:${salt}`;
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  }, [target, salt]);

  useEffect(() => {
    if (solved) return;
    const within = Math.abs(value - target) <= 2; // must align closely
    let t: ReturnType<typeof setTimeout> | undefined;
    if (within) {
      // Require a short steady hold to avoid accidental hits
      t = setTimeout(() => { setSolved(true); onSolved(token); }, 450);
    }
    return () => { if (t) clearTimeout(t); };
  }, [value, target, token, solved, onSolved]);

  // Precisely position glow based on rail geometry to match handle position
  const recalc =useCallback (() => {
    const el = wrapRef.current?.querySelector<HTMLElement>('.ant-slider-rail');
    const root = wrapRef.current;
    if (!el || !root) return;
    const rail = el.getBoundingClientRect();
    const box = root.getBoundingClientRect();
    const left = (rail.left - box.left) + (target / 100) * rail.width;
    const top = (rail.top - box.top) + rail.height / 2 - 6;
    setGlowPos({ left, top });
  }, [target])
  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(() => recalc());
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', recalc);
    return () => { window.removeEventListener('resize', recalc); ro.disconnect(); };
    // target affects position on each mount
  }, [recalc]);

  return (
    <div className="human-box">
      <div className="human-instruction">{solved ? "Verified — you’re human 🎉" : "Slide the black dot to the glowing notch"}</div>
      <div className="human-slider" style={{ position: "relative" }} ref={wrapRef}>
        <div aria-hidden style={{ position: "absolute", left: glowPos.left, top: glowPos.top, width: 12, height: 12, borderRadius: 12, background: "#10b981", boxShadow: "0 0 12px rgba(16,185,129,0.9)" }} />
        <Slider
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(v) => typeof v === "number" && setValue(v)}
          disabled={solved}
          tooltip={{ open: false }}
        />
      </div>
    </div>
  );
}
