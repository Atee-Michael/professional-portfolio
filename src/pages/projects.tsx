import { Row, Col } from "antd";
import ProjectCard from "@/components/ProjectCard";
import projects from "@/data/projects.json"; 

export default function Projects() {
  return (
    <section className="section">
      <div className="container">
        <Row gutter={[24, 24]}>
          {(projects as any[]).map((p) => (
            <Col xs={24} md={12} lg={8} key={p.title}>
              <ProjectCard {...p} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
