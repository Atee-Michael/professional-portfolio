import { Row, Col } from "antd";
import { useMemo, useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import projects from "@/data/projects.json"; 
import { Project } from "@/types/project";

export default function Projects() {
  const projectList = projects as Project[];
  const filters = useMemo(() => {
    const set = new Set<string>();
    projectList.forEach(p => p.categories?.forEach(c => set.add(c)));
    return ["All", ...Array.from(set)];
  }, [projectList]);
  const [active, setActive] = useState<string>("All");
  const list = active === "All" ? projectList : projectList.filter(p => p.categories?.includes(active));
  return (
    <section className="section">
      <div className="container">
        <div className="filter-bar">
          {filters.map(f => (
            <button key={f} className={`filter-chip ${active === f ? 'active' : ''}`} onClick={() => setActive(f)}>{f}</button>
          ))}
        </div>
        <Row gutter={[24, 24]}>
          {list.map((p) => (
            <Col xs={24} md={12} lg={8} key={p.title}>
              <ProjectCard {...p} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}
