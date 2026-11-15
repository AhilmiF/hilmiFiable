import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import ConfirmModal from "../../../components/admin/ConfirmModal"
import { useAuth } from "../../../context/AuthContext"

const API = "http://localhost:5000/api/v1"

const ManageGallery = () => {
  const { token } = useAuth()
  const [galleries, setGalleries] = useState([])
  const [photo, setPhoto] = useState(null)
  const [modal, setModal] = useState({ open: false, id: null })
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [loading, setLoading] = useState(false)

  const fetchGalleries = async () => {
    const res = await fetch(`${API}/gallery`)
    const data = await res.json()
    if (data.success) setGalleries(data.data)
  }

  useEffect(() => { fetchGalleries() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!photo) return setMsg({ type: "error", text: "Pilih foto terlebih dahulu." })

    setLoading(true)
    setMsg({ type: "", text: "" })
    const fd = new FormData()
    fd.append("photo", photo)
    try {
      const res = await fetch(`${API}/gallery/admin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Foto berhasil ditambahkan." })
        setPhoto(null)
        e.target.reset()
        fetchGalleries()
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal upload foto." })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/gallery/admin/${modal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Foto berhasil dihapus." })
        fetchGalleries()
      }
    } catch {
      setMsg({ type: "error", text: "Gagal menghapus foto." })
    } finally {
      setModal({ open: false, id: null })
    }
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <h2 className="admin-page-title">Tambah Foto</h2>

        {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}

        <form onSubmit={handleUpload}>
          <div className="admin-form-group" style={{ marginBottom: "16px" }}>
            <label className="admin-form-label">Upload:</label>
            <input
              type="file"
              className="admin-form-file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
          </div>

          <div className="admin-form-group" style={{ marginBottom: "16px" }}>
            <label className="admin-form-label">Foto</label>
            <div className="gallery-grid">
              {galleries.map((g) => (
                <div key={g.id} className="gallery-item">
                  <img src={`http://localhost:5000${g.photoUrl}`} alt="gallery" />
                  <button
                    type="button"
                    className="gallery-item__delete"
                    onClick={() => setModal({ open: true, id: g.id })}
                  >✕</button>
                </div>
              ))}
              {galleries.length === 0 && (
                <p style={{ color: "#aaa", fontSize: "13px" }}>Belum ada foto.</p>
              )}
            </div>
          </div>

          <div className="form-submit-row">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Mengupload..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={modal.open}
        onConfirm={handleDelete}
        onCancel={() => setModal({ open: false, id: null })}
      />
    </AdminLayout>
  )
}

export default ManageGallery
