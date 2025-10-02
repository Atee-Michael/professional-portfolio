import { Row, Col, Typography, Button, Card, Space } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Portrait from "@/components/Portrait";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
  };

  const fade: Variants = { hidden: { opacity: 0 }, show: { opacity: 1 } };

  return (
    <section className="section home-bg">
      <motion.div variants={container} initial="hidden" animate="show">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={14}>
            <motion.div variants={itemUp}>
              <Title className="gradient-text" style={{ marginTop: 0 }}>
                Cybersecurity • Cloud • Full‑Stack
              </Title>
            </motion.div>
            <motion.div variants={itemUp}>
              <Paragraph style={{ fontSize: 18, color: "var(--muted)", maxWidth: 680 }}>
                I build secure, scalable, and maintainable systems with clear engineering rationale.
              </Paragraph>
            </motion.div>
            <motion.div variants={itemUp}>
              <Space wrap>
                <Button className="premium-btn" size="large" href="/docs/michael-atee-cv.pdf" download>
                  Download CV
                </Button>
                <Link href="/projects">
                  <Button className="outline-btn" size="large">View Projects</Button>
                </Link>
                <Link href="/security">
                  <Button className="premium-btn" size="large">Security Overview</Button>
                </Link>
              </Space>
            </motion.div>
          </Col>

          <Col xs={24} md={10}>
            <motion.div variants={fade}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <Portrait />
              </div>
              <Card title="Highlights" bordered className="premium-card">
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li>OWASP, NIST CSF, ISO 27001 in practice</li>
                  <li>Premium dark‑olive aesthetic with glossy finish</li>
                  <li>Per‑project technical documentation</li>
                </ul>
              </Card>
            </motion.div>
          </Col>
        </Row>

        <div style={{ height: 32 }} />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <motion.div variants={itemUp}>
              <Card className="premium-card">
                <Text strong>Cybersecurity Engineering</Text>
                <Paragraph style={{ marginBottom: 0 }}>Vulnerability scanning, secure SDLC, hardened configs.</Paragraph>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} md={8}>
            <motion.div variants={itemUp}>
              <Card className="premium-card">
                <Text strong>Cloud and Architecture</Text>
                <Paragraph style={{ marginBottom: 0 }}>AWS, scalable architectures, resilient deployments.</Paragraph>
              </Card>
            </motion.div>
          </Col>
          <Col xs={24} md={8}>
            <motion.div variants={itemUp}>
              <Card className="premium-card">
                <Text strong>Frontend Engineering</Text>
                <Paragraph style={{ marginBottom: 0 }}>Next.js, React, Ant Design, component systems.</Paragraph>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </motion.div>
    </section>
  );
}
