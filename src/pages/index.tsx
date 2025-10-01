import { Row, Col, Typography, Button, Card, Space } from "antd";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  return (
    <section className="section">
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={14}>
          <Title style={{ color: "var(--text)", marginTop: 0 }}>Cybersecurity · Cloud · Full-Stack</Title>
          <Paragraph style={{ fontSize: 18, color: "var(--muted)" }}>
            I build secure, scalable, and maintainable systems with clear engineering rationale.
          </Paragraph>
          <Space wrap>
            <Button type="primary" size="large" href="/docs/michael-atee-cv.pdf" download>
              Download CV
            </Button>
            <Link href="/projects"><Button size="large">View Projects</Button></Link>
            <Link href="/security"><Button size="large">Security Overview</Button></Link>
          </Space>
        </Col>

        <Col xs={24} md={10}>
          <Card title="Highlights" bordered>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>OWASP, NIST CSF, ISO 27001 in practice</li>
              <li>Autumn palette theme with Ant Design</li>
              <li>Per-project technical documentation</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <div style={{ height: 32 }} />

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <Text strong>Cybersecurity Engineering</Text>
            <Paragraph>Vulnerability scanning, secure SDLC, hardened configs.</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Text strong>Cloud and Architecture</Text>
            <Paragraph>AWS, scalable architectures, resilient deployments.</Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Text strong>Frontend Engineering</Text>
            <Paragraph>Next.js, React, Ant Design, component design systems.</Paragraph>
          </Card>
        </Col>
      </Row>
    </section>
  );
}
