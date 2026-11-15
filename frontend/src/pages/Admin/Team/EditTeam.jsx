import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { useAuth } from "../../../context/AuthContext"

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1` : "http://localhost:5000/api/v1"

const EditTeam = () => {
  const { id } = useParams()
  const { token } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    category: "",
    role: "",
    bio: "",
    bioDua: "",
    instagramUrl: "",
    linkedinUrl: "",
    portfolioUrl: "",
  })
  const [photo, setPhoto] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [currentPhoto, setCurrentPhoto] = useState("")
  const [currentPortfolio, setCurrentPortfolio] = useState("")
  const [positions, setPositions] = useState([])
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    // Fetch positions/categories
    fetch(`${API}/position`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPositions(d.data)
      })
      .catch(() => {})

    // Fetch team member details
    fetch(`${API}/team/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          const m = d.data
          setForm({
            name: m.name || "",
            specialty: m.specialty || "",
            category: m.category || "",
            role: m.role || "",
            bio: m.bio || "",
            bioDua: m.bioDua || "",
            instagramUrl: m.instagramUrl || "",
            linkedinUrl: m.linkedinUrl || "",
            portfolioUrl: m.portfolioUrl || "",
          })
          setCurrentPhoto(m.photoUrl || "")
          setCurrentPortfolio(m.portfolioUrl || "")
        } else {
          setMsg({ type: "error", text: "Data anggota tim tidak ditemukan." })
        }
      })
      .catch(() => {
        setMsg({ type: "error", text: "Gagal mengambil data tim dari server." })
      })
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMsg({ type: "", text: "" })

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (photo) fd.append("photo", photo)
    if (portfolio) fd.append("portfolio", portfolio)

    try {
      const res = await fetch(`${API}/team/admin/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Data tim berhasil diperbarui!" })
        setTimeout(() => navigate("/admin/manage-team"), 1200)
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal memperbarui data tim." })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <AdminLayout>
        <div className="admin-card">
          <p style={{ color: "#888" }}>Memuat formulir edit tim...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <h2 className="admin-page-title">Edit Team Member</h2>

        {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              className="admin-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Kategori / Posisi *</label>
            <select
              className="admin-input"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">-- Pilih Posisi --</option>
              <option value="partner">Partner Profile</option>
              <option value="legalConsultan">Legal Consultant Profile</option>
              <option value="lawyer">Lawyer Profile</option>
              {positions
                .filter((p) => !["partner", "legalConsultan", "lawyer"].includes(p.slug))
                .map((p) => (
                  <option key={p.id} value={p.slug || p.name}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Jabatan Khusus (Opsional, misal: Managing Partner)</label>
            <input
              type="text"
              className="admin-input"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Spesialisasi</label>
            <input
              type="text"
              className="admin-input"
              value={form.specialty}
              onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Bio Paragraf 1</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Bio Paragraf 2 (Opsional)</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.bioDua}
              onChange={(e) => setForm({ ...form, bioDua: e.target.value })}
            />
          </div>

          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Instagram URL</label>
              <input
                type="text"
                className="admin-input"
                value={form.instagramUrl}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">LinkedIn URL</label>
              <input
                type="text"
                className="admin-input"
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Ganti Foto Profil (Biarkan kosong jika tidak diubah)</label>
            {currentPhoto && (
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                Foto saat ini: {currentPhoto}
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              className="admin-input"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Upload Portfolio File (PDF)</label>
            {currentPortfolio && (
              <p style={{ fontSize: "12px", color: "#666", marginBottom: "6px" }}>
                Portfolio saat ini: {currentPortfolio}
              </p>
            )}
            <input
              type="file"
              accept=".pdf"
              className="admin-input"
              onChange={(e) => setPortfolio(e.target.files[0])}
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Atau Masukkan Link Portfolio Online (Google Drive / URL PDF)</label>
            <input
              type="text"
              placeholder="https://..."
              className="admin-input"
              value={form.portfolioUrl}
              onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/admin/manage-team")}
            >
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default EditTeam
