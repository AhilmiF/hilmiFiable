import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { useAuth } from "../../../context/AuthContext"

const API = "http://localhost:5000/api/v1"

const AddPost = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ judul: "", slug: "", kategori: "", konten: "" })
  const [photo, setPhoto] = useState(null)
  const [positions, setPositions] = useState([])
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/position`).then(r => r.json()).then(d => {
      if (d.success) setPositions(d.data)
    })
  }, [])

  const handleJudulChange = (e) => {
    const val = e.target.value
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    setForm({ ...form, judul: val, slug })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (photo) fd.append("photo", photo)

    try {
      const res = await fetch(`${API}/artikel/admin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Artikel berhasil ditambahkan!" })
        setForm({ judul: "", slug: "", kategori: "", konten: "" })
        setPhoto(null)
        setTimeout(() => navigate("/admin/manage-post"), 1200)
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal terhubung ke server." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <h2 className="admin-page-title">Tambah Postingan Baru</h2>

        {msg.text && (
          <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Judul</label>
            <input
              className="admin-form-input"
              value={form.judul}
              onChange={handleJudulChange}
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

          <div className="admin-form-group">
            <label className="admin-form-label">Kategori</label>
            <select
              className="admin-form-select"
              value={form.kategori}
              onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            >
              <option value="">-- Pilih Kategori --</option>
              {positions.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Foto</label>
            <input
              type="file"
              className="admin-form-file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Body</label>
            <textarea
              className="admin-form-textarea"
              value={form.konten}
              onChange={(e) => setForm({ ...form, konten: e.target.value })}
              rows={6}
            />
          </div>

          <div className="form-submit-row">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AddPost
