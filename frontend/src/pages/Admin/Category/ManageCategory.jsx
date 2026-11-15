import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import ConfirmModal from "../../../components/admin/ConfirmModal"

// Kategori untuk postingan / artikel berita
const INITIAL_CATEGORIES = [
  { id: "1", name: "Hukum", slug: "hukum" },
  { id: "2", name: "Keadilan", slug: "keadilan" },
  { id: "3", name: "Listrik", slug: "listrik" },
  { id: "4", name: "Pipa", slug: "pipa" },
]

const ManageCategory = () => {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("fiable_article_categories")
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES
  })
  const [view, setView] = useState("list") // "list" | "add" | "edit"
  const [form, setForm] = useState({ name: "", slug: "" })
  const [editId, setEditId] = useState(null)
  const [modal, setModal] = useState({ open: false, id: null })
  const [msg, setMsg] = useState({ type: "", text: "" })

  const saveCategories = (updated) => {
    setCategories(updated)
    localStorage.setItem("fiable_article_categories", JSON.stringify(updated))
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
      const updated = categories.map((c) =>
        c.id === editId ? { ...c, name: form.name, slug: form.slug } : c
      )
      saveCategories(updated)
      setMsg({ type: "success", text: "Kategori artikel berhasil diperbarui." })
    } else {
      const newCat = {
        id: Date.now().toString(),
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, "-"),
      }
      saveCategories([...categories, newCat])
      setMsg({ type: "success", text: "Kategori artikel berhasil ditambahkan." })
    }

    setView("list")
    setForm({ name: "", slug: "" })
    setEditId(null)
  }

  const handleEdit = (c) => {
    setEditId(c.id)
    setForm({ name: c.name, slug: c.slug || "" })
    setView("edit")
    setMsg({ type: "", text: "" })
  }

  const handleDelete = () => {
    const updated = categories.filter((c) => c.id !== modal.id)
    saveCategories(updated)
    setMsg({ type: "success", text: "Kategori artikel berhasil dihapus." })
    setModal({ open: false, id: null })
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        {view === "list" ? (
          <>
            <div className="admin-page-header">
              <h2 className="admin-page-title" style={{ margin: 0 }}>
                Manage Category (Post / Artikel)
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
                  <th>Kategori Artikel</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "#999" }}>
                      Belum ada kategori artikel.
                    </td>
                  </tr>
                ) : (
                  categories.map((c, i) => (
                    <tr key={c.id}>
                      <td>{i + 1}</td>
                      <td>{c.name}</td>
                      <td style={{ textAlign: "center" }}>
                        <button className="action-btn" onClick={() => handleEdit(c)} title="Edit">
                          ✏️
                        </button>
                        <button
                          className="action-btn action-btn--danger"
                          onClick={() => setModal({ open: true, id: c.id })}
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
            <h2 className="admin-page-title">
              {view === "edit" ? "Edit Kategori Artikel" : "Tambah Kategori Artikel"}
            </h2>
            {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Nama Kategori</label>
                <input
                  className="admin-form-input"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="Misal: Hukum Perdata"
                  required
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug</label>
                <input
                  className="admin-form-input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="misal: hukum-perdata"
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

export default ManageCategory
