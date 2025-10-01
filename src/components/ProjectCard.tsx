import { Card, Tag, Space, Button } from "antd";
import { Project } from "@/types/project";

export default function ProjectCard({ title, description, stack, repoLink, liveLink, docPath }: Project) {
  return (
    <Card title={title}>
      <p>{description}</p>
      <Space wrap style={{ marginBottom: 12 }}>
        {stack.map((s) => (
          <Tag key={s} color="#D4A017" style={{ color: "#0B3D2E" }}>
            {s}
          </Tag>
        ))}
      </Space>
      <Space wrap>
        {repoLink && (
          <Button href={repoLink} target="_blank" rel="noreferrer">
            View Project
          </Button>
        )}
        {liveLink && (
          <Button href={liveLink} target="_blank" rel="noreferrer">
            Live Demo
          </Button>
        )}
        <Button type="primary" href={docPath} download>
          Download Docs
        </Button>
      </Space>
    </Card>
  );
}
