import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import ConfirmModal from "../../../components/admin/ConfirmModal"
import { useAuth } from "../../../context/AuthContext"

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1` : "http://localhost:5000/api/v1"

const ManageCategory = () => {
  const { token } = useAuth()
  const [positions, setPositions] = useState([])
  const [view, setView] = useState("list") // "list" | "add" | "edit"
  const [form, setForm] = useState({ name: "", slug: "" })
  const [editId, setEditId] = useState(null)
  const [modal, setModal] = useState({ open: false, id: null })
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  const fetchPositions = async () => {
    try {
      const res = await fetch(`${API}/position`)
      const data = await res.json()
      if (data.success) setPositions(data.data)
    } catch {
      setMsg({ type: "error", text: "Gagal memuat kategori." })
    }
  }

  useEffect(() => {
    fetchPositions()
  }, [])

  const handleNameChange = (e) => {
    const val = e.target.value
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    setForm({ ...form, name: val, slug })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })
    try {
      const url = editId ? `${API}/position/admin/${editId}` : `${API}/position/admin`
      const method = editId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: editId ? "Kategori berhasil diperbarui." : "Kategori berhasil ditambahkan." })
        fetchPositions()
        setView("list")
        setForm({ name: "", slug: "" })
        setEditId(null)
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal terhubung ke server." })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ name: p.name, slug: p.slug || "" })
    setView("edit")
    setMsg({ type: "", text: "" })
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/position/admin/${modal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Kategori berhasil dihapus." })
        fetchPositions()
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal menghapus kategori." })
    } finally {
      setModal({ open: false, id: null })
    }
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        {view === "list" ? (
          <>
            <div className="admin-page-header">
              <h2 className="admin-page-title" style={{ margin: 0 }}>
                Manage Category
              </h2>
              <button
                className="btn-header"
                onClick={() => {
                  setView("add")
                  setForm({ name: "", slug: "" })
                  setMsg({ type: "", text: "" })
                }}
              >
                Tambah
              </button>
            </div>

            {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}

            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: "60px" }}>No.</th>
                  <th>Kategori</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#999" }}>
                      Belum ada kategori.
                    </td>
                  </tr>
                ) : (
                  positions.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>{p.name}</td>
                      <td style={{ textAlign: "center" }}>
                        <button className="action-btn" onClick={() => handleEdit(p)} title="Edit">
                          ✏️
                        </button>
                        <button
                          className="action-btn action-btn--danger"
                          onClick={() => setModal({ open: true, id: p.id })}
                          title="Hapus"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h2 className="admin-page-title">{view === "edit" ? "Edit Kategori" : "Tambah Kategori Baru"}</h2>
            {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Nama Kategori</label>
                <input
                  className="admin-form-input"
                  value={form.name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug</label>
                <input
                  className="admin-form-input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div className="form-submit-row">
                <button
                  type="button"
                  className="btn-primary"
                  style={{ background: "#888", marginRight: "8px" }}
                  onClick={() => setView("list")}
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Menyimpan..." : view === "edit" ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={modal.open}
        onConfirm={handleDelete}
        onCancel={() => setModal({ open: false, id: null })}
      />
    </AdminLayout>
  )
}

export default ManageCategory
