import { Typography, Row, Col, Card, Space, Button, Tag } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import Portrait from "@/components/Portrait";
import React, { useEffect, useRef } from "react";

const { Title, Paragraph } = Typography;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AboutPage() {
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const sections = () => Array.from(el.querySelectorAll<HTMLElement>(".snap-section"));
    const scrollToIndex = (idx: number) => {
      const list = sections();
      if (idx < 0 || idx >= list.length) return;
      list[idx].scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const onKey = (e: KeyboardEvent) => {
      const keysDown = ["ArrowDown", "PageDown", " "];
      const keysUp = ["ArrowUp", "PageUp"]; 
      if (![...keysDown, ...keysUp].includes(e.key)) return;
      e.preventDefault();
      const list = sections();
      const y = el.scrollTop + 1; // avoid edge rounding
      const vh = el.clientHeight;
      const current = Math.floor(y / vh);
      if (keysDown.includes(e.key)) scrollToIndex(current + 1);
      else scrollToIndex(current - 1);
    };
    el.addEventListener("keydown", onKey);
    // Focus container to capture keys
    el.setAttribute("tabindex", "0");
    el.focus({ preventScroll: true });
    return () => el.removeEventListener("keydown", onKey);
  }, []);
  return (
    <main className="about-snap" ref={mainRef}>
      {/* Section 1: Hero */}
      <section id="a-hero" className="snap-section section-vignette about-hero">
        <motion.div className="container full-center" variants={container} initial="hidden" animate="show">
          <motion.div variants={item} style={{ textAlign: "center" }}>
            <Title style={{ marginTop: 0 }}>About Michael Atee</Title>
            <Paragraph className="about-lede" style={{ maxWidth: 800, margin: "8px auto" }}>
              Security technologist with 10+ years across retail, consulting, and automotive. I translate risk into clear actions — turning
              compliance and architecture topics into friendly, collaborative delivery.
            </Paragraph>
          </motion.div>
          <motion.div variants={item} style={{ marginTop: 12 }}>
            <Portrait />
          </motion.div>
          <motion.a variants={item} href="#a-value" className="hero-down" aria-label="Next section">↓</motion.a>
        </motion.div>
      </section>

      {/* Section 2: What I do / How I work */}
      <section id="a-value" className="snap-section section-vignette">
        <motion.div className="container full-center" variants={container} initial="hidden" animate="show">
          <Row gutter={[24, 24]} className="same-height-grid">
            <Col xs={24} md={12}>
              <motion.div variants={item}>
                <Card className="xp-card fill-card">
                  <Title level={2} style={{ marginTop: 0 }}>What I Do</Title>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>Third‑party vendor reviews and due‑diligence documentation.</li>
                    <li>Data flow diagrams and secure connectivity mapping.</li>
                    <li>DPIA and BCP with stakeholders and clear reporting.</li>
                    <li>Risk identification, escalation, and compliance tracking.</li>
                  </ul>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={12}>
              <motion.div variants={item}>
                <Card className="xp-card fill-card">
                  <Title level={2} style={{ marginTop: 0 }}>How I Work</Title>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    <li>Translate requirements into diagrams, controls, and actions.</li>
                    <li>Bridge technical and non‑technical teams with clarity.</li>
                    <li>Evidence‑driven: organized, measurable, audit‑friendly.</li>
                    <li>Enablement mindset: security that supports delivery.</li>
                  </ul>
                </Card>
              </motion.div>
            </Col>
          </Row>
          <motion.a variants={item} href="#a-experience" className="hero-down" aria-label="Next section">↓</motion.a>
        </motion.div>
      </section>

      {/* Section 3: Experience */}
      <section id="a-experience" className="snap-section section-vignette">
        <motion.div className="container full-center" variants={container} initial="hidden" animate="show">
          <Row gutter={[24, 24]} className="same-height-grid">
            {[{
              role: "Deputy Store Manager (Tech‑focused ops)",
              org: "ALDI UK (Charlton)",
              date: "2021 – Present",
              desc: "Incident escalation, POS support, and secure operational outcomes.",
            },{
              role: "IT Manager",
              org: "Le Nouveau Moteur (BMW Togo)",
              date: "2016 – 2022",
              desc: "Vendor access, ISPI Next migration, encryption + cloud backup.",
            },{
              role: "Associate – Institutional Reform & IT",
              org: "Shawbell Consulting",
              date: "2012 – 2016",
              desc: "Vendor assessments and secure system documentation on intl. projects.",
            }].map((x) => (
              <Col xs={24} md={8} key={x.role}>
                <motion.div variants={item}>
                  <Card className="xp-card fill-card">
                    <div className="xp-header">
                      <div>
                        <strong>{x.role}</strong>
                        <div className="xp-company">{x.org}</div>
                      </div>
                      <span className="xp-date">{x.date}</span>
                    </div>
                    <Paragraph className="xp-desc" style={{ marginTop: 6 }}>{x.desc}</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
          <motion.a variants={item} href="#a-credentials" className="hero-down" aria-label="Next section">↓</motion.a>
        </motion.div>
      </section>

      {/* Section 4: Credentials & Tools */}
      <section id="a-credentials" className="snap-section section-vignette">
        <motion.div className="container full-center" variants={container} initial="hidden" animate="show">
          <Row gutter={[24, 24]} className="same-height-grid">
            <Col xs={24} md={12}>
              <motion.div variants={item}>
                <Card className="xp-card fill-card">
                  <Title level={2} style={{ marginTop: 0 }}>Education</Title>
                  <Paragraph style={{ marginBottom: 8 }}>
                    MSc Computer Science with Cyber Security — University of Kent (2025)
                  </Paragraph>
                  <Paragraph className="muted" style={{ marginTop: 0 }}>
                    Modules: Information Security Management, Digital Forensics, Network Security, Systems Architecture, Web Applications
                  </Paragraph>
                  <Paragraph style={{ marginBottom: 0 }}>BBA Banking & Finance — Valley View University (2011)</Paragraph>
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} md={12}>
              <motion.div variants={item}>
                <Card className="xp-card fill-card">
                  <Title level={2} style={{ marginTop: 0 }}>Certifications</Title>
                  <Space wrap>
                    {[
                      "AWS Solutions Architect (renewal in progress)",
                      "BCS Essentials in AI",
                      "Applied Scrum (UMD)",
                      "ITIL Foundation (in progress)",
                    ].map((c) => (
                      <Tag key={c} className="value-chip">{c}</Tag>
                    ))}
                  </Space>
                </Card>
              </motion.div>
            </Col>
          </Row>
          <div style={{ height: 14 }} />
          <motion.div variants={item} style={{ textAlign: "center" }}>
            <Space wrap>
              <Link href="/projects"><Button className="outline-btn" size="large">View Projects</Button></Link>
              <Link href="/#skills"><Button className="outline-btn" size="large">Explore Skills</Button></Link>
              <Link href="/#contact"><Button className="premium-btn" size="large">Get In Touch</Button></Link>
            </Space>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
