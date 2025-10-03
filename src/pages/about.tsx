import { Typography, Row, Col, Card, Space, Button, Tag } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";

const { Title, Paragraph, Text } = Typography;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AboutPage() {
  return (
    <section className="section">
      <motion.div className="container" variants={container} initial="hidden" animate="show">
        {/* Intro */}
        <motion.div variants={item} className="about-header">
          <Title level={1} style={{ marginTop: 0 }}>About Michael Atee</Title>
          <Paragraph className="about-lede">
            Customer‑focused Security Technologist bridging business, engineering, and compliance.
            I help teams ship secure systems with clear documentation, pragmatic risk management,
            and friendly collaboration.
          </Paragraph>
        </motion.div>

        {/* Business Value */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <motion.div variants={item}>
              <Card className="xp-card">
                <Title level={3} style={{ marginTop: 0 }}>What I Do</Title>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Third‑party vendor reviews and due‑diligence documentation.</li>
                  <li>Data flow diagrams and secure connectivity mapping for clarity.</li>
                  <li>DPIA execution and Business Continuity planning with stakeholders.</li>
                  <li>Risk identification, escalation, and compliance tracking.</li>
                </ul>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} md={12}>
            <motion.div variants={item}>
              <Card className="xp-card">
                <Title level={3} style={{ marginTop: 0 }}>How I Work</Title>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>Translate requirements into diagrams, controls, and clear actions.</li>
                  <li>Partner with both technical and non‑technical teams.</li>
                  <li>Keep evidence organized and measurable for audits and reviews.</li>
                  <li>Bias to enablement: security that supports delivery.</li>
                </ul>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <div style={{ height: 16 }} />

        {/* Experience highlights */}
        <Row gutter={[24, 24]}>
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
                <Card className="xp-card">
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

        <div style={{ height: 16 }} />

        {/* Credentials */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <motion.div variants={item}>
              <Card className="xp-card">
                <Title level={3} style={{ marginTop: 0 }}>Education</Title>
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
              <Card className="xp-card">
                <Title level={3} style={{ marginTop: 0 }}>Certifications</Title>
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

        <div style={{ height: 16 }} />

        {/* Tools & Methods */}
        <motion.div variants={item}>
          <Card className="xp-card">
            <Title level={3} style={{ marginTop: 0 }}>Methods & Tooling</Title>
            <div className="tools-grid">
              {["Vendor Risk", "DPIA", "BCP", "Data Flow Diagrams", "Wireshark", "Nmap", "Microsoft 365", "SharePoint", "GitHub", "Jira", "Zendesk", "Python", "JavaScript", "React"].map((t) => (
                <span key={t} className="tool-chip">{t}</span>
              ))}
            </div>
          </Card>
        </motion.div>

        <div style={{ height: 20 }} />

        {/* CTA */}
        <motion.div variants={item} style={{ textAlign: "center" }}>
          <Space wrap>
            <Link href="/projects"><Button className="outline-btn" size="large">View Projects</Button></Link>
            <Link href="/#skills"><Button className="outline-btn" size="large">Explore Skills</Button></Link>
            <Link href="/#contact"><Button className="premium-btn" size="large">Get In Touch</Button></Link>
            <a href="/docs/michael-atee-cv.pdf" className="outline-btn ant-btn ant-btn-default" download rel="noreferrer">Download CV</a>
          </Space>
        </motion.div>
      </motion.div>
    </section>
  );
}

