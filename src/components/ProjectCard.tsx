import { Card, Tag, Space, Button, Typography } from "antd";
import { Project } from "@/types/project";
import { motion } from "framer-motion";

const { Paragraph } = Typography;

export default function ProjectCard({ title, description, stack, repoLink, liveLink, docPath }: Project) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card className="premium-card" title={<span className="gradient-text">{title}</span>}>
        <Paragraph style={{ marginBottom: 16 }}>{description}</Paragraph>

        <Space wrap style={{ marginBottom: 16 }}>
          {stack.map((s) => (
            <Tag
              key={s}
              style={{
                background: "var(--creative-gradient-2)",
                color: "#fff",
                borderRadius: "var(--radius)",
                fontWeight: 500,
              }}
            >
              {s}
            </Tag>
          ))}
        </Space>

        <Space wrap>
          {repoLink && (
            <Button className="outline-btn" href={repoLink} target="_blank" rel="noreferrer">
              View Project
            </Button>
          )}
          {liveLink && (
            <Button className="outline-btn" href={liveLink} target="_blank" rel="noreferrer">
              Live Demo
            </Button>
          )}
          {docPath && (
            <Button className="premium-btn" href={docPath} download>
              Download Docs
            </Button>
          )}
        </Space>
      </Card>
    </motion.div>
  );
}
