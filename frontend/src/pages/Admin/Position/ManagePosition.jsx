import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import ConfirmModal from "../../../components/admin/ConfirmModal"

// Posisi tim tetap mandiri (Partner, Legal Consultant, Lawyer Profile)
const INITIAL_POSITIONS = [
  { id: "partner", name: "PARTNER PROFILE", slug: "partner" },
  { id: "legalConsultan", name: "LEGAL CONSULTANT PROFILE", slug: "legalConsultan" },
  { id: "lawyer", name: "LAWYER PROFILE", slug: "lawyer" },
]

const ManagePosition = () => {
  const [positions, setPositions] = useState(() => {
    const saved = localStorage.getItem("fiable_team_positions")
    return saved ? JSON.parse(saved) : INITIAL_POSITIONS
  })
  const [view, setView] = useState("list")
  const [form, setForm] = useState({ name: "", slug: "" })
  const [editId, setEditId] = useState(null)
  const [modal, setModal] = useState({ open: false, id: null })
  const [msg, setMsg] = useState({ type: "", text: "" })

  const savePositions = (updated) => {
    setPositions(updated)
    localStorage.setItem("fiable_team_positions", JSON.stringify(updated))
  }

  const handleNameChange = (e) => {
    const val = e.target.value
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    setForm({ ...form, name: val, slug })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMsg({ type: "", text: "" })

    if (editId) {
      const updated = positions.map((p) =>
        p.id === editId ? { ...p, name: form.name.toUpperCase(), slug: form.slug } : p
      )
      savePositions(updated)
      setMsg({ type: "success", text: "Posisi berhasil diperbarui." })
    } else {
      const newPos = {
        id: Date.now().toString(),
        name: form.name.toUpperCase(),
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      }
      savePositions([...positions, newPos])
      setMsg({ type: "success", text: "Posisi berhasil ditambahkan." })
    }

    setView("list")
    setForm({ name: "", slug: "" })
    setEditId(null)
  }

  const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ name: p.name, slug: p.slug || "" })
    setView("edit")
    setMsg({ type: "", text: "" })
  }

  const handleDelete = () => {
    const updated = positions.filter((p) => p.id !== modal.id)
    savePositions(updated)
    setMsg({ type: "success", text: "Posisi berhasil dihapus." })
    setModal({ open: false, id: null })
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        {view === "list" ? (
          <>
            <div className="admin-page-header">
              <h2 className="admin-page-title" style={{ margin: 0 }}>
                Manage Position
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
                      Belum ada posisi.
                    </td>
                  </tr>
                ) : (
                  positions.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 500, letterSpacing: "0.5px" }}>{p.name}</td>
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
            <h2 className="admin-page-title">{view === "edit" ? "Edit Posisi" : "Tambah Posisi Baru"}</h2>
            {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Nama Posisi</label>
                <input
                  className="admin-form-input"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="Misal: LAWYER PROFILE"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug</label>
                <input
                  className="admin-form-input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="misal: lawyer-profile"
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
                <button type="submit" className="btn-primary">
                  {view === "edit" ? "Simpan Perubahan" : "Tambah"}
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

export default ManagePosition
