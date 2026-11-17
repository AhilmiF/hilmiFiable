import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { useAuth } from "../../../context/AuthContext"

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1` : "http://localhost:5000/api/v1"

const EditPost = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ judul: "", slug: "", kategori: "", konten: "" })
  const [photo, setPhoto] = useState(null)
  const [positions, setPositions] = useState([])
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/artikel/${id}`).then(r => r.json()).then(d => {
      if (d.success) {
        const { judul, slug, kategori, konten, keterangan } = d.data
        setForm({ judul, slug, kategori: kategori || "", konten: konten || keterangan || "" })
      }
    })
    fetch(`${API}/position`).then(r => r.json()).then(d => {
      if (d.success) setPositions(d.data)
    })
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (!form.keterangan && form.konten) {
      fd.append("keterangan", form.konten)
    }
    if (photo) fd.append("photo", photo)

    try {
      const res = await fetch(`${API}/artikel/admin/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Artikel berhasil diperbarui!" })
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
        <h2 className="admin-page-title">Edit Postingan</h2>

        {msg.text && (
          <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Judul</label>
            <input
              className="admin-form-input"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
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
            <label className="admin-form-label">Ganti Foto (opsional)</label>
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
            <button type="button" className="btn-primary" style={{ background: "#888", marginRight: "8px" }} onClick={() => navigate("/admin/manage-post")}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default EditPost
