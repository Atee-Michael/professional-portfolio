import { Typography, Button, Row, Col, Card, Tag } from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Variants } from "framer-motion";
import Portrait from "@/components/Portrait";
import ProjectCard from "@/components/ProjectCard";
import projects from "@/data/projects.json";
import type { Project } from "@/types/project";

const { Title, Paragraph } = Typography;

export default function Home() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const up: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
  const allProjects = projects as Project[];
  const allFilters = useMemo(() => {
    const set = new Set<string>();
    allProjects.forEach(p => p.categories?.forEach(c => set.add(c)));
    return ["All", ...Array.from(set)];
  }, [allProjects]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const filtered = useMemo(() => activeFilter === "All" ? allProjects : allProjects.filter(p => p.categories?.includes(activeFilter)), [activeFilter, allProjects]);

  return (
    <>
      <section className="section home-bg" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <motion.div className="container hero" variants={container} initial="hidden" animate="show">
          <motion.div variants={up} className="hero-badge">Welcome to my digital realm</motion.div>

          <motion.div variants={up} className="hero-name">
            <span className="hero-first gradient-text">Michael</span>
            <span className="hero-last">Atee</span>
          </motion.div>

          <motion.hr variants={up} className="hero-underline" />

          <motion.div variants={up}>
            <Title level={2} className="hero-focus gradient-text">Cybersecurity • Cloud • Frontend</Title>
          </motion.div>

          <motion.p variants={up} className="hero-tagline">
            I blend artistry with engineering to create digital experiences that don’t just work—they inspire. I can build secure, scalable systems.
          </motion.p>

          <motion.div variants={up} className="hero-portrait">
            <Portrait />
          </motion.div>

          <motion.div variants={up} className="hero-ctas">
            <Link href="#contact" scroll>
              <Button size="large" className="premium-btn">Let’s Collaborate</Button>
            </Link>
            <Link href="/projects">
              <Button size="large" className="outline-btn">View My Work</Button>
            </Link>
            <Button size="large" className="outline-btn" href="/docs/michael-atee-cv.pdf" download>
              Download CV
            </Button>
          </motion.div>

          <motion.div variants={up} className="hero-socials">
            <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.41-1.34-1.78-1.34-1.78-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.92 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.81 5.61-5.49 5.91.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .5Z"/></svg>
            </a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.14V24h-4v-7.3c0-1.74-.03-3.98-2.43-3.98-2.44 0-2.81 1.9-2.81 3.86V24h-4V8z"/></svg>
            </a>
            <a href="mailto:hello@example.com" aria-label="Email" className="social-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 13.065 1.5 6h21L12 13.065zM12 15.5 1.5 8.25V18h21V8.25L12 15.5z"/></svg>
            </a>
          </motion.div>

          <motion.a variants={up} href="#about" className="hero-down" aria-label="Scroll to About">↓</motion.a>
        </motion.div>
      </section>

      

      <section id="about" className="section">
        <div className="container">
          <div className="about-header">
            <Title level={2} style={{ marginTop: 0 }}>About Me</Title>
            <Paragraph className="about-lede">
              Passionate about creating digital experiences that make a difference. With over 5 years of
              experience across cybersecurity, cloud, and frontend, I bridge technical execution with creative vision.
            </Paragraph>
          </div>

          {/* 2x2 grid: story + values on left, experience spans right */}
          <div className="about-grid">
            <div className="about-story">
              <Title level={3} style={{ color: "var(--foreground)", marginTop: 0 }}>My Story</Title>
              <Paragraph className="about-text">
                My journey in tech began with a curiosity about how things work. What started as tinkering with code
                evolved into a passion for building secure, scalable, and elegant solutions that solve real problems.
              </Paragraph>
              <Paragraph className="about-text">
                I specialize in full‑stack development with a strong focus on user experience and security. A background
                spanning design and engineering lets me translate ideas into resilient systems and polished interfaces.
              </Paragraph>
              <Paragraph className="about-text">
                When I’m not coding, I’m exploring new technologies, contributing to open‑source, or mentoring
                aspiring developers in the community.
              </Paragraph>
            </div>

            <div className="about-values">
              <Title level={4} style={{ marginBottom: 12 }}>Core Values</Title>
              <div className="values-grid">
                <Card size="small" className="xp-card">
                  <Tag className="value-chip">Innovation</Tag>
                  <Paragraph>Explore new technologies and creative solutions to complex problems.</Paragraph>
                </Card>
                <Card size="small" className="xp-card">
                  <Tag className="value-chip">Security</Tag>
                  <Paragraph>Build with defense‑in‑depth principles and protect users’ data by default.</Paragraph>
                </Card>
                <Card size="small" className="xp-card">
                  <Tag className="value-chip">Quality</Tag>
                  <Paragraph>Write clean, maintainable code and deliver exceptional user experiences.</Paragraph>
                </Card>
                <Card size="small" className="xp-card">
                  <Tag className="value-chip">Reliability</Tag>
                  <Paragraph>Design for scalability and resilience with clear observability and testing.</Paragraph>
                </Card>
                <Card size="small" className="xp-card">
                  <Tag className="value-chip">Accessibility</Tag>
                  <Paragraph>Create inclusive interfaces that are usable by everyone.</Paragraph>
                </Card>
                <Card size="small" className="xp-card">
                  <Tag className="value-chip">Collaboration</Tag>
                  <Paragraph>Foster openness and teamwork to achieve great results.</Paragraph>
                </Card>
              </div>
            </div>

            <div className="about-experience">
              <Title level={3} style={{ color: "var(--foreground)", marginTop: 0 }}>Experience</Title>
              <div className="experience-list">
                <Card className="xp-card">
                  <div className="xp-header">
                    <div>
                      <strong>Senior Full‑Stack Developer</strong>
                      <div className="xp-company">Tech Innovations Inc.</div>
                    </div>
                    <span className="xp-date">2022 – Present</span>
                  </div>
                  <Paragraph className="xp-desc">Lead development of secure, scalable web applications using React, Node.js, and cloud technologies.</Paragraph>
                </Card>

                <Card className="xp-card">
                  <div className="xp-header">
                    <div>
                      <strong>UI/UX Developer</strong>
                      <div className="xp-company">Digital Design Studio</div>
                    </div>
                    <span className="xp-date">2020 – 2022</span>
                  </div>
                  <Paragraph className="xp-desc">Created user‑centered designs and implemented responsive interfaces across platforms.</Paragraph>
                </Card>

                <Card className="xp-card">
                  <div className="xp-header">
                    <div>
                      <strong>Frontend Developer</strong>
                      <div className="xp-company">Startup XYZ</div>
                    </div>
                    <span className="xp-date">2019 – 2020</span>
                  </div>
                  <Paragraph className="xp-desc">Built component libraries and optimized performance for growth‑stage features.</Paragraph>
                </Card>

                <Card className="xp-card">
                  <div className="xp-header">
                    <div>
                      <strong>IT Support</strong>
                      <div className="xp-company">Shwbell Consulting</div>
                    </div>
                    <span className="xp-date">2012 – 2016</span>
                  </div>
                  <Paragraph className="xp-desc">Provided end‑user support, managed tickets, and maintained workstations and network peripherals.</Paragraph>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* Skills & Expertise */}
      <section id="skills" className="section">
        <div className="container">
          <div className="about-header">
            <Title level={2} style={{ marginTop: 0 }}>Skills & Expertise</Title>
            <Paragraph className="about-lede">
              A comprehensive skill set spanning the full development lifecycle — from discovery and design to implementation and operations.
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="xp-card skill-card" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#14b8a6' }}>
                <div className="skill-head">
                  <span className="skill-icon">🛡️</span>
                  <strong>Cybersecurity</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["Threat Modeling", 90],
                    ["OWASP Top 10", 92],
                    ["Secure SDLC", 88],
                    ["Vulnerability Management", 86],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="xp-card skill-card" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#22c55e' }}>
                <div className="skill-head">
                  <span className="skill-icon">🛜</span>
                  <strong>Networking</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["TCP/IP", 92],
                    ["Routing & Switching", 85],
                    ["Firewalls/VPN", 86],
                    ["DNS/DHCP", 90],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="xp-card skill-card" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#ef4444' }}>
                <div className="skill-head">
                  <span className="skill-icon">🏗️</span>
                  <strong>Systems Design</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["Microservices", 88],
                    ["Event-Driven", 84],
                    ["Caching & CDN", 86],
                    ["Observability", 82],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          <div style={{ height: 16 }} />

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="xp-card skill-card" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#ff7a00' }}>
                <div className="skill-head">
                  <span className="skill-icon">&lt;/&gt;</span>
                  <strong>Frontend Development</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["React/Next.js", 95],
                    ["TypeScript", 90],
                    ["Tailwind/Ant Design", 92],
                    ["Vue.js", 80],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="xp-card skill-card tint" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#4aa8ff' }}>
                <div className="skill-head">
                  <span className="skill-icon">🗄️</span>
                  <strong>Backend Development</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["Node.js", 90],
                    ["Python", 85],
                    ["PostgreSQL", 88],
                    ["MongoDB", 82],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="xp-card skill-card" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#06b6d4' }}>
                <div className="skill-head">
                  <span className="skill-icon">☁️</span>
                  <strong>Cloud & DevOps</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["AWS", 85],
                    ["Docker", 82],
                    ["CI/CD", 88],
                    ["Kubernetes", 75],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          <div style={{ height: 16 }} />

          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card className="xp-card skill-card" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#f59e0b' }}>
                <div className="skill-head">
                  <span className="skill-icon">🎨</span>
                  <strong>UI/UX Design</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["Figma", 92],
                    ["Prototyping", 90],
                    ["Design Systems", 88],
                    ["User Research", 78],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="xp-card skill-card tint" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#8b5cf6' }}>
                <div className="skill-head">
                  <span className="skill-icon">🌐</span>
                  <strong>Web Technologies</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["GraphQL", 87],
                    ["REST APIs", 95],
                    ["WebSocket", 80],
                    ["Service Workers", 83],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card className="xp-card skill-card" bodyStyle={{ padding: 18 }} style={{ ['--bar-color' as any]: '#84cc16' }}>
                <div className="skill-head">
                  <span className="skill-icon">✅</span>
                  <strong>Testing & Quality</strong>
                </div>
                <div className="skill-list">
                  {[
                    ["Unit/Integration", 90],
                    ["E2E (Playwright)", 85],
                    ["Performance", 82],
                    ["Security Testing", 88],
                  ].map(([label, pct]) => (
                    <div className="skill-row" key={String(label)}>
                      <span>{label as string}</span>
                      <div className="skill-track"><div className="skill-fill" style={{ width: pct + "%" }} /></div>
                      <span className="skill-pct">{pct as number}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>

          
        </div>
      </section>

      {/* Tools & Technologies — separate section with vignette and fade-in */}
      <section id="tools" className="section section-vignette">
        <motion.div className="container" variants={container} initial="hidden" animate="show">
          <div className="about-header">
            <div className="soft-divider" />
            <Title level={2} style={{ marginTop: 0 }}>Tools & Technologies</Title>
            <Paragraph className="about-lede">Frameworks, platforms, and services I use daily.</Paragraph>
          </div>
          <motion.div variants={up} className="tools-grid">
            {["VS Code", "GitHub", "Postman", "Vercel", "Supabase", "Stripe", "Framer", "Linear", "Slack", "Notion", "Jira", "Firebase"].map(tool => (
              <span className="tool-chip" key={tool}>{tool}</span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Projects (after Tools & Tech) */}
      <section id="projects" className="section section-vignette">
        <motion.div className="container" variants={container} initial="hidden" animate="show">
          <div className="about-header">
            <div className="soft-divider" />
            <Title level={2} style={{ marginTop: 0 }}>Featured Projects</Title>
            <Paragraph className="about-lede">
              A selection of work spanning security, frontend, backend, and cloud.
            </Paragraph>
          </div>

          <motion.div variants={up} className="filter-bar">
            {allFilters.map(f => (
              <button key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
          </motion.div>

          <Row gutter={[24, 24]}>
            {filtered.slice(0, 3).map((p) => (
              <Col xs={24} md={12} lg={8} key={p.title}>
                <ProjectCard {...p} />
              </Col>
            ))}
          </Row>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <Button className="outline-btn" size="large" href="/projects">
              View All Projects
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  );
}
