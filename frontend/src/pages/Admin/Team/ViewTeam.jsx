import { useState, useEffect } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import AdminLayout from "../../../components/admin/AdminLayout"
import { getFileUrl } from "../../../services/api"

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1` : "http://localhost:5000/api/v1"

const ViewTeam = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [member, setMember] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${API}/team/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setMember(d.data)
        } else {
          setError("Data tidak ditemukan.")
        }
      })
      .catch(() => setError("Gagal mengambil data dari server."))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-card">
          <p style={{ color: "#888" }}>Memuat detail tim...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error || !member) {
    return (
      <AdminLayout>
        <div className="admin-card">
          <p style={{ color: "#c00" }}>{error || "Anggota tim tidak ditemukan."}</p>
          <button className="btn-cancel" onClick={() => navigate("/admin/manage-team")}>
            Kembali
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <div className="admin-page-header">
          <h2 className="admin-page-title" style={{ margin: 0 }}>Detail Anggota Tim</h2>
          <Link to={`/admin/edit-team/${member.id}`} className="btn-header">
            Edit
          </Link>
        </div>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "20px" }}>
          {member.photoUrl && (
            <div>
              <img
                src={getFileUrl(member.photoUrl)}
                alt={member.name}
                style={{ width: "200px", height: "auto", borderRadius: "8px", objectFit: "cover" }}
              />
            </div>
          )}

          <div style={{ flex: 1, minWidth: "260px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{member.name}</h3>
            <p style={{ margin: "4px 0", color: "#555" }}>
              <strong>Kategori:</strong> {member.category}
            </p>
            {member.role && (
              <p style={{ margin: "4px 0", color: "#555" }}>
                <strong>Role:</strong> {member.role}
              </p>
            )}
            {member.specialty && (
              <p style={{ margin: "4px 0", color: "#555" }}>
                <strong>Spesialisasi:</strong> {member.specialty}
              </p>
            )}
            {member.bio && (
              <p style={{ margin: "12px 0 6px 0", color: "#333", lineHeight: 1.6 }}>
                <strong>Bio:</strong> {member.bio}
              </p>
            )}
            {member.bioDua && (
              <p style={{ margin: "6px 0", color: "#333", lineHeight: 1.6 }}>{member.bioDua}</p>
            )}

            <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {member.portfolioUrl ? (
                <a
                  href={getFileUrl(member.portfolioUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ textDecoration: "none", display: "inline-block" }}
                >
                  Download / Lihat Portfolio 📄
                </a>
              ) : (
                <span style={{ color: "#999", fontSize: "13px", alignSelf: "center" }}>
                  (Portfolio belum diupload)
                </span>
              )}

              <button className="btn-cancel" onClick={() => navigate("/admin/manage-team")}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ViewTeam
