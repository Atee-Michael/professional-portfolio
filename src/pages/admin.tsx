import { useEffect, useMemo, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Card, Form, Input, Modal, Space, Table, Tag, message, Upload } from "antd";
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
    const res = await fetch(`/api/admin/projects?index=${index}`, { method: "DELETE" });
    if (!res.ok) return message.error("Delete failed");
    message.success("Deleted");
    fetchData();
  };

  const onFinish = async (values: any) => {
    const payload: Project = {
      title: values.title,
      description: values.description,
      stack: values.stack?.split(",").map((s: string) => s.trim()).filter(Boolean) || [],
      repoLink: values.repoLink,
      liveLink: values.liveLink,
      categories: values.categories?.split(",").map((s: string) => s.trim()).filter(Boolean) || [],
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
    const b64 = await file.arrayBuffer().then((buf) => Buffer.from(buf).toString("base64"));
    const res = await fetch("/api/admin/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileBase64: b64, filename: file.name }) });
    const json = await res.json();
    if (!res.ok) return message.error(json.error || "Upload failed");
    message.success("Uploaded");
    (document.getElementById("docPath") as HTMLInputElement).value = json.docPath;
    return false as any;
  };

  if (status === "loading") return null;
  if (!isAdmin) {
    return (
      <section className="section">
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
    <section className="section">
      <div className="container">
        <Space style={{ marginBottom: 12 }}>
          <Button onClick={() => signOut()}>Sign out</Button>
          <Button onClick={() => setEditing({ index: -1, initial: { title: "", description: "", stack: [], docPath: "" } as any })}>New Project</Button>
        </Space>

        <Table<Project> rowKey={(r, i) => String(i)} columns={columns} dataSource={data} loading={loading} pagination={false} />

        <Modal
          title={editing && editing.index >= 0 ? "Edit Project" : "New Project"}
          open={!!editing}
          onCancel={() => setEditing(null)}
          footer={null}
          destroyOnClose
        >
          <Form id="admin-form" layout="vertical" onFinish={onFinish} initialValues={editing?.initial}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input maxLength={120} />
            </Form.Item>
            <Form.Item name="description" label="Description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} maxLength={600} />
            </Form.Item>
            <Form.Item name="stack" label="Stack (comma‑separated)">
              <Input maxLength={200} />
            </Form.Item>
            <Form.Item name="categories" label="Categories (comma‑separated)">
              <Input maxLength={200} />
            </Form.Item>
            <Form.Item name="repoLink" label="Repo Link">
              <Input type="url" maxLength={300} />
            </Form.Item>
            <Form.Item name="liveLink" label="Live Link">
              <Input type="url" maxLength={300} />
            </Form.Item>
            <Form.Item name="docPath" label="Doc Path">
              <Input id="docPath" readOnly />
            </Form.Item>
            <Upload beforeUpload={uploadPdf} showUploadList={false} accept="application/pdf">
              <Button icon={<UploadOutlined />}>Upload PDF</Button>
            </Upload>
            <div style={{ height: 12 }} />
            <Button type="primary" htmlType="submit">Save</Button>
          </Form>
        </Modal>
      </div>
    </section>
  );
}

