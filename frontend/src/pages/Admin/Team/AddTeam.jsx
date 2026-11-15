import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { useAuth } from "../../../context/AuthContext"

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1` : "http://localhost:5000/api/v1"

const AddTeam = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "", specialty: "", category: "", bio: "",
    instagramUrl: "https://", linkedinUrl: "https://",
  })
  const [photo, setPhoto] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [positions, setPositions] = useState([])
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`${API}/position`).then(r => r.json()).then(d => {
      if (d.success) setPositions(d.data)
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (photo) fd.append("photo", photo)
    if (portfolio) fd.append("portfolio", portfolio)

    try {
      const res = await fetch(`${API}/team/admin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Anggota tim berhasil ditambahkan!" })
        setTimeout(() => navigate("/admin/manage-team"), 1200)
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal terhubung ke server." })
    } finally {
      setLoading(false)
    }
  }

  const f = (field) => ({
    value: form[field],
    onChange: (e) => setForm({ ...form, [field]: e.target.value }),
  })

  return (
    <AdminLayout>
      <div className="admin-card">
        <h2 className="admin-page-title">Add Team</h2>

        {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Nama</label>
            <input className="admin-form-input" {...f("name")} required />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Spesialisasi</label>
            <input className="admin-form-input" {...f("specialty")} />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Posisi</label>
            <select className="admin-form-select" {...f("category")} required>
              <option value="">-- Pilih Posisi --</option>
              {positions.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Biomore</label>
            <textarea className="admin-form-textarea" {...f("bio")} rows={5} />
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
            <label className="admin-form-label">Portfolio (pdf)</label>
            <input
              type="file"
              className="admin-form-file"
              accept=".pdf"
              onChange={(e) => setPortfolio(e.target.files[0])}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Instagram</label>
            <input className="admin-form-input" {...f("instagramUrl")} type="url" />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Linkedin</label>
            <input className="admin-form-input" {...f("linkedinUrl")} type="url" />
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

export default AddTeam
