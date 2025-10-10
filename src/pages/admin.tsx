import { useEffect, useMemo, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Card, Form, Input, Modal, Space, Table, Tag, message, Upload, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";

type Project = {
  title: string;
  description: string;
  stack: string[];
  repoLink?: string;
  liveLink?: string;
  docPath: string;
  categories?: string[];
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const isAdmin = Boolean(session?.user && (session.user as any).isAdmin);
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ index: number; initial: Project } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/projects");
    if (!res.ok) { setLoading(false); return message.error("Failed to load"); }
    const json = await res.json();
    setData(json);
    setLoading(false);
  };
  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  // Skills admin state (must be declared before any conditional returns)
  const [skills, setSkills] = useState<any[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const loadSkills = async () => { setSkillsLoading(true); const r = await fetch("/api/admin/skills"); if (r.ok) setSkills(await r.json()); setSkillsLoading(false); };
  useEffect(() => { if (isAdmin) loadSkills(); }, [isAdmin]);

  const [skillEdit, setSkillEdit] = useState<{ index: number; initial: any } | null>(null);
  const saveSkill = async (vals: any) => {
    const payload = { title: vals.title, color: vals.color, items: (vals.itemsText || "").split("\n").map((l: string) => l.trim()).filter(Boolean).map((l: string) => { const [name, pct] = l.split("|"); return { name: name?.trim(), percent: Number(pct) || 0 }; }) };
    const method = skillEdit && skillEdit.index >= 0 ? "PUT" : "POST";
    const url = skillEdit && skillEdit.index >= 0 ? `/api/admin/skills?index=${skillEdit.index}` : "/api/admin/skills";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return message.error("Skill save failed");
    setSkillEdit(null); loadSkills();
  };

  const onEditSkill = (i: number, r: any) => {
    const itemsText = (r.items || []).map((it: any) => `${it.name}|${it.percent}`).join("\n");
    setSkillEdit({ index: i, initial: { ...r, itemsText } });
  };

  const onDeleteSkill = (i: number) => {
    Modal.confirm({ title: "Delete?", onOk: async ()=>{ const rr = await fetch(`/api/admin/skills?index=${i}`, { method: 'DELETE'}); if(rr.ok) loadSkills(); else message.error('Delete failed'); } });
  };

  // Tools admin state (must be declared before any conditional returns)
  const [tools, setTools] = useState<string[]>([]);
  const [toolsLoading, setToolsLoading] = useState(false);
  const loadTools = async () => { setToolsLoading(true); const r = await fetch("/api/admin/tools"); if (r.ok) setTools(await r.json()); setToolsLoading(false); };
  useEffect(() => { if (isAdmin) loadTools(); }, [isAdmin]);
  const saveTools = async (vals: any) => { const arr = (vals.toolsText || "").split("\n").map((l: string) => l.trim()).filter(Boolean); const r = await fetch("/api/admin/tools", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tools: arr }) }); if (!r.ok) return message.error("Save failed"); message.success("Saved"); loadTools(); };

  // Audit log state
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const loadLogs = async () => { setLogsLoading(true); const r = await fetch("/api/admin/logs?limit=200"); if (r.ok) setLogs(await r.json()); setLogsLoading(false); };
  useEffect(() => { if (isAdmin) loadLogs(); }, [isAdmin]);

  // Admin idle sign-out
  useEffect(() => {
    if (!isAdmin) return; // only track on admin
    const minutes = Number(process.env.NEXT_PUBLIC_ADMIN_IDLE_MINUTES) || 15; // default 15 mins
    const timeoutMs = Math.max(1, minutes) * 60_000;
    let timer: any = null;
    let signedOut = false;

    const schedule = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!signedOut) {
          signedOut = true;
          message.warning("Signed out due to inactivity");
          signOut();
        }
      }, timeoutMs);
    };

    const onActivity = () => {
      if (signedOut) return;
      schedule();
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "visibilitychange"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true } as any));
    schedule();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onActivity as any));
    };
  }, [isAdmin]);

  const columns: ColumnsType<Project> = [
    { title: "Title", dataIndex: "title" },
    { title: "Stack", dataIndex: "stack", render: (s: string[]) => <Space wrap>{s?.map((t) => <Tag key={t}>{t}</Tag>)}</Space> },
    { title: "Docs", dataIndex: "docPath" },
    {
      title: "Actions",
      render: (_, r, idx) => (
        <Space>
          <Button size="small" onClick={() => setEditing({ index: idx, initial: r })}>Edit</Button>
          <Button size="small" danger onClick={() => onDelete(idx)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const onDelete = async (index: number) => {
    Modal.confirm({
      title: "Delete project?",
      content: "This cannot be undone.",
      okType: "danger",
      onOk: async () => {
        const prev = data;
        setData((d) => d.filter((_, i) => i !== index));
        const res = await fetch(`/api/admin/projects?index=${index}`, { method: "DELETE" });
        if (!res.ok) {
          setData(prev); message.error("Delete failed");
        } else message.success("Deleted");
      },
    });
  };

  const onFinish = async (values: any) => {
    const toArray = (v: any): string[] => {
      if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
      return String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    };

    const payload: Project = {
      title: values.title,
      description: values.description,
      stack: toArray(values.stack),
      repoLink: values.repoLink,
      liveLink: values.liveLink,
      categories: toArray(values.categories),
      docPath: values.docPath || "",
    };
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/admin/projects?index=${editing.index}` : "/api/admin/projects";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) return message.error("Save failed");
    setEditing(null);
    (document.getElementById("admin-form") as HTMLFormElement)?.reset();
    fetchData();
    message.success("Saved");
  };

  const uploadPdf = async (file: File) => {
    if (file.type !== "application/pdf") { message.error("PDF only"); return Upload.LIST_IGNORE as any; }
    if (file.size > 10 * 1024 * 1024) { message.error("Max 10MB"); return Upload.LIST_IGNORE as any; }
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!res.ok) return message.error(json.error || "Upload failed");
    message.success("Uploaded");
    (document.getElementById("docPath") as HTMLInputElement).value = json.docPath;
    return false as any;
  };

  if (status === "loading") return null;
  if (!isAdmin) {
    return (
      <section className="section admin-page">
        <div className="container" style={{ textAlign: "center" }}>
          <Card className="xp-card" style={{ maxWidth: 560, margin: "0 auto" }}>
            <h3>Admin Access Required</h3>
            <p>Sign in with an authorized account to manage portfolio content.</p>
            <Button type="primary" onClick={() => signIn()}>Sign In</Button>
          </Card>
        </div>
      </section>
    );
  }


  return (
    <section className="section admin-page">
      <div className="container">
        <Space style={{ marginBottom: 12 }}>
          <Button onClick={() => signOut()}>Sign out</Button>
          <Button onClick={() => setEditing({ index: -1, initial: { title: "", description: "", stack: [], docPath: "" } as any })}>New Project</Button>
          <Button onClick={() => setSkillEdit({ index: -1, initial: { title: "", color: "#14b8a6", itemsText: "" } })}>New Skill Category</Button>
        </Space>

        <Tabs items={[
          {
            key: "projects",
            label: "Projects",
            children: (
              <>
                <Table<Project> rowKey={(r, i) => String(i)} columns={columns} dataSource={data} loading={loading} pagination={false} />
              </>
            ),
          },
          {
            key: "skills",
            label: "Skills & Expertise",
            children: (
              <>
                <Table<any>
                  rowKey={(r, i) => String(i)}
                  loading={skillsLoading}
                  dataSource={skills}
                  columns={[
                    { title: "Title", dataIndex: "title" },
                    { title: "Items", render: (_, r) => <Space wrap>{r.items?.map((it: any) => <Tag key={it.name}>{it.name}:{it.percent}%</Tag>)}</Space> },
                    { title: "Actions", render: (_: any, r: any, i: number) => (
                      <Space>
                        <Button size="small" onClick={() => onEditSkill(i, r)}>Edit</Button>
                        <Button danger size="small" onClick={() => onDeleteSkill(i)}>Delete</Button>
                      </Space>
                    ) },
                  ]}
                  pagination={false}
                />
              </>
            ),
          },
          {
            key: "tools",
            label: "Tools & Technologies",
            children: (
              <>
                <Card className="xp-card">
                  <Form layout="vertical" onFinish={saveTools} initialValues={{ toolsText: tools.join("\n") }}>
                    <Form.Item name="toolsText" label="Tools (one per line)">
                      <Input.TextArea rows={8} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Save Tools</Button>
                  </Form>
                </Card>
              </>
            ),
          },
          {
            key: "logs",
            label: "Audit Log",
            children: (
              <>
                <Card className="xp-card">
                  <Space style={{ marginBottom: 12 }}>
                    <Button onClick={loadLogs} loading={logsLoading}>Refresh</Button>
                  </Space>
                  <Table<any>
                    rowKey={(r, i) => String(i)}
                    loading={logsLoading}
                    dataSource={logs}
                    pagination={{ pageSize: 10 }}
                    columns={[
                      { title: "When", dataIndex: "ts", render: (v: string) => v ? new Date(v).toLocaleString() : "" },
                      { title: "User", dataIndex: "user" },
                      { title: "Action", dataIndex: "action" },
                      { title: "Detail", render: (_, r) => <code style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(r.detail ?? r.raw ?? {}, null, 0)}</code> },
                    ]}
                  />
                </Card>
              </>
            ),
          },
        ]} />

        {/* Project Modal */}
        <Modal title={editing && editing.index >= 0 ? "Edit Project" : "New Project"} open={!!editing} onCancel={() => setEditing(null)} footer={null} destroyOnClose>
          <Form
            id="admin-form"
            layout="vertical"
            onFinish={onFinish}
            initialValues={editing ? { ...editing.initial, stack: editing.initial?.stack?.join(", "), categories: editing.initial?.categories?.join(", ") } : undefined}
          >
            <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input maxLength={120} /></Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}><Input.TextArea rows={4} maxLength={600} /></Form.Item>
            <Form.Item name="stack" label="Stack (comma-separated)"><Input maxLength={200} /></Form.Item>
            <Form.Item name="categories" label="Categories (comma-separated)"><Input maxLength={200} /></Form.Item>
            <Form.Item name="repoLink" label="Repo Link"><Input type="url" maxLength={300} /></Form.Item>
            <Form.Item name="liveLink" label="Live Link"><Input type="url" maxLength={300} /></Form.Item>
            <Form.Item name="docPath" label="Doc Path"><Input id="docPath" readOnly /></Form.Item>
            <Upload beforeUpload={uploadPdf} showUploadList={false} accept="application/pdf"><Button icon={<UploadOutlined />}>Upload PDF</Button></Upload>
            <div style={{ height: 12 }} />
            <Button type="primary" htmlType="submit">Save</Button>
          </Form>
        </Modal>

        {/* Skill Modal */}
        <Modal title={skillEdit && skillEdit.index >= 0 ? "Edit Skill Category" : "New Skill Category"} open={!!skillEdit} onCancel={() => setSkillEdit(null)} footer={null} destroyOnClose>
          <Form layout="vertical" onFinish={saveSkill} initialValues={skillEdit?.initial}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}><Input maxLength={64} /></Form.Item>
            <Form.Item name="color" label="Accent Color"><Input maxLength={16} placeholder="#14b8a6" /></Form.Item>
            <Form.Item name="itemsText" label="Items (one per line: Name|Percent)"><Input.TextArea rows={8} /></Form.Item>
            <Button type="primary" htmlType="submit">Save</Button>
          </Form>
        </Modal>
      </div>
    </section>
  );
}

