import { Button } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";
import Portrait from "./Portrait";

export default function Hero() {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "80px 0" }}>
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle at center, var(--accent-mustard), transparent 70%)",
          filter: "blur(120px)",
          animation: "float1 12s infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50px",
          right: "-150px",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle at center, var(--accent-navy), transparent 70%)",
          filter: "blur(140px)",
          animation: "float2 10s infinite alternate",
        }}
      />

      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "32px" }}>
        <Portrait />
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "40px",
            fontWeight: 700,
            background: "linear-gradient(90deg, var(--accent-mustard), var(--accent-navy))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
          }}
        >
          Cybersecurity · Cloud · Full‑Stack
        </motion.h1>
        <p style={{ maxWidth: "600px", fontSize: "18px" }}>
          I build secure, scalable, maintainable systems with clear engineering rationale.
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <Button type="primary" size="large" href="/docs/michael-atee-cv.pdf" style={{ borderRadius: "24px" }}>
            Download CV
          </Button>
          <Link href="/projects">
            <Button size="large" style={{ borderRadius: "24px" }}>
              View Projects
            </Button>
          </Link>
          <Link href="/security">
            <Button size="large" style={{ borderRadius: "24px" }}>
              Security Overview
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

