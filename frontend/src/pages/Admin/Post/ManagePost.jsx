import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import ConfirmModal from "../../../components/admin/ConfirmModal"
import { useAuth } from "../../../context/AuthContext"

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1` : "http://localhost:5000/api/v1"

const ManagePost = () => {
  const { token } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, id: null })
  const [msg, setMsg] = useState({ type: "", text: "" })

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/artikel`)
      const data = await res.json()
      if (data.success) setArticles(data.data)
    } catch {
      setMsg({ type: "error", text: "Gagal memuat data artikel." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArticles() }, [])

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/artikel/admin/${modal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Artikel berhasil dihapus." })
        fetchArticles()
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal menghapus artikel." })
    } finally {
      setModal({ open: false, id: null })
    }
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <div className="admin-page-header">
          <h2 className="admin-page-title" style={{ margin: 0 }}>Manage Post</h2>
        </div>

        {msg.text && (
          <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>
        )}

        {loading ? (
          <p style={{ color: "#888", fontSize: "13px" }}>Memuat data...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Judul Portofolio</th>
                <th>Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", color: "#999" }}>Belum ada artikel.</td></tr>
              ) : articles.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.judul}</td>
                  <td>{a.kategori || "-"}</td>
                  <td>
                    <a
                      href={`/artikel/${a.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="action-btn"
                      title="Lihat"
                    >👁</a>
                    <Link
                      to={`/admin/edit-post/${a.id}`}
                      className="action-btn"
                      title="Edit"
                    >✏️</Link>
                    <button
                      className="action-btn action-btn--danger"
                      title="Hapus"
                      onClick={() => setModal({ open: true, id: a.id })}
                    >🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ManagePost
