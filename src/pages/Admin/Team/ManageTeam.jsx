import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import ConfirmModal from "../../../components/admin/ConfirmModal"
import { useAuth } from "../../../context/AuthContext"

const API = "http://localhost:5000/api/v1"

const ManageTeam = () => {
  const { token } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, id: null })
  const [msg, setMsg] = useState({ type: "", text: "" })

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/team`)
      const data = await res.json()
      if (data.success) setMembers(data.data)
    } catch {
      setMsg({ type: "error", text: "Gagal memuat data tim." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API}/team/admin/${modal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Anggota tim berhasil dihapus." })
        fetchMembers()
      } else {
        setMsg({ type: "error", text: data.message })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal menghapus anggota tim." })
    } finally {
      setModal({ open: false, id: null })
    }
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <div className="admin-page-header">
          <h2 className="admin-page-title" style={{ margin: 0 }}>Manage Team</h2>
          <Link to="/admin/add-team" className="btn-header">Tambah</Link>
        </div>

        {msg.text && <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>}

        {loading ? (
          <p style={{ color: "#888", fontSize: "13px" }}>Memuat data...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Nama</th>
                <th>Posisi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", color: "#999" }}>Belum ada anggota tim.</td></tr>
              ) : members.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.name}</td>
                  <td>{m.category ? m.category.toUpperCase().replace('LEGALCONSULTAN', 'LEGAL CONSULTANT') + ' PROFILE' : '-'}</td>
                  <td>
                    <Link to={`/admin/view-team/${m.id}`} className="action-btn" title="Lihat">👁</Link>
                    <Link to={`/admin/edit-team/${m.id}`} className="action-btn" title="Edit">✏️</Link>
                    <button
                      className="action-btn action-btn--danger"
                      title="Hapus"
                      onClick={() => setModal({ open: true, id: m.id })}
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

export default ManageTeam
