import Link from "next/link";
import { Layout, Menu, Grid, Drawer, Button } from "antd";
import { ReactNode, useState } from "react";
import dynamic from "next/dynamic";
const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

const navItems = [
  { key: "home", label: <Link href="/">Home</Link> },
  { key: "about", label: <Link href="/about">About</Link> },
  { key: "skills", label: <Link href="/#skills">Skills</Link> },
  { key: "projects", label: <Link href="/projects">Projects</Link> },
  { key: "contact", label: <Link href="/#contact">Contact</Link> },
];

export default function SiteLayout({ children }: { children: ReactNode }) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [open, setOpen] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ color: "#D4A017", fontWeight: 700, fontSize: 18, letterSpacing: 0.4 }}>
            Michael Atee
          </Link>
          <div style={{ flex: 1 }} />
          {isMobile ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ThemeToggle />
                <Button aria-label="Open Menu" onClick={() => setOpen(true)} className="outline-btn" size="small">
                  {/* simple hamburger */}
                  <span style={{ display: "inline-block", width: 18, height: 2, background: "currentColor" }} />
                  <span style={{ display: "inline-block", width: 18, height: 2, background: "currentColor", marginLeft: 4 }} />
                </Button>
              </div>
              <Drawer
                placement="right"
                open={open}
                onClose={() => setOpen(false)}
                bodyStyle={{ padding: 0 }}
                rootClassName="site-drawer"
                styles={{ content: { background: "rgba(255,255,255,0.96)" } }}
              >
                <div style={{ padding: 12, display: "flex", justifyContent: "flex-end" }}>
                  <ThemeToggle />
                </div>
                <Menu
                  mode="vertical"
                  items={navItems}
                  style={{ background: "transparent", borderRight: "none" }}
                  className="site-nav"
                  onClick={() => setOpen(false)}
                />
              </Drawer>
            </>
          ) : (
            <>
              <Menu
                mode="horizontal"
                theme="dark"
                items={navItems}
                style={{ background: "transparent", borderBottom: "none" }}
                className="site-nav"
              />
              <div style={{ marginLeft: 8 }}>
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </Header>

      <Content style={{ padding: "32px 0" }}>
        <div className="container">{children}</div>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        © {new Date().getFullYear()} Michael Atee · Built with Next.js and Ant Design
      </Footer>
    </Layout>
  );
}
