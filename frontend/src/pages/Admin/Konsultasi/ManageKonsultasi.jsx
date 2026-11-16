import { useState, useEffect } from "react"
import AdminLayout from "../../../components/admin/AdminLayout"
import { useAuth } from "../../../context/AuthContext"

const API = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/v1`
  : "http://localhost:5000/api/v1"

const ManageKonsultasi = () => {
  const { token } = useAuth()
  const [konsultasiList, setKonsultasiList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedKonsul, setSelectedKonsul] = useState(null)
  const [msg, setMsg] = useState({ type: "", text: "" })
  const [updatingId, setUpdatingId] = useState(null)

  const fetchKonsultasi = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/konsultasi/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.success) {
        setKonsultasiList(data.data)
      } else {
        setMsg({ type: "error", text: data.message || "Gagal memuat konsultasi." })
      }
    } catch {
      setMsg({ type: "error", text: "Gagal memuat data konsultasi." })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKonsultasi()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      const res = await fetch(`${API}/konsultasi/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: "success", text: "Status konsultasi berhasil diubah." })
        setKonsultasiList((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        )
        if (selectedKonsul && selectedKonsul.id === id) {
          setSelectedKonsul((prev) => ({ ...prev, status: newStatus }))
        }
      } else {
        setMsg({ type: "error", text: data.message || "Gagal mengubah status." })
      }
    } catch {
      setMsg({ type: "error", text: "Terjadi kesalahan saat mengubah status." })
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="admin-card">
        <div className="admin-page-header">
          <h2 className="admin-page-title" style={{ margin: 0 }}>
            Manage Konsultasi
          </h2>
        </div>

        {msg.text && (
          <div className={`admin-alert admin-alert--${msg.type}`}>{msg.text}</div>
        )}

        {loading ? (
          <p className="admin-loading">Memuat data konsultasi...</p>
        ) : konsultasiList.length === 0 ? (
          <p className="admin-empty">Belum ada pengajuan konsultasi masuk.</p>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No Telepon</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {konsultasiList.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <a href={`mailto:${item.email}`} style={{ color: "#f9a000" }}>
                        {item.email}
                      </a>
                    </td>
                    <td>
                      <a href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" style={{ color: "#25D366" }}>
                        {item.phone}
                      </a>
                    </td>
                    <td>
                      <select
                        value={item.status}
                        disabled={updatingId === item.id}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          fontWeight: "bold",
                          backgroundColor:
                            item.status === "DONE"
                              ? "#e6f4ea"
                              : item.status === "CONTACTED"
                              ? "#e8f0fe"
                              : "#fff3e0",
                          color:
                            item.status === "DONE"
                              ? "#137333"
                              : item.status === "CONTACTED"
                              ? "#1a73e8"
                              : "#b06000",
                        }}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="admin-btn admin-btn--view"
                        onClick={() => setSelectedKonsul(item)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Detail Konsultasi */}
        {selectedKonsul && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                maxWidth: "600px",
                width: "90%",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#111827" }}>
                Detail Pengajuan Konsultasi
              </h3>
              <div style={{ marginBottom: "12px" }}>
                <strong>Nama:</strong> {selectedKonsul.name}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Email:</strong> {selectedKonsul.email}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>No Telepon:</strong> {selectedKonsul.phone}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Status:</strong>{" "}
                <span style={{ fontWeight: "bold" }}>{selectedKonsul.status}</span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <strong>Kronologi / Posisi Kasus:</strong>
                <div
                  style={{
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#f9fafb",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.5",
                  }}
                >
                  {selectedKonsul.kronologi}
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button
                  className="admin-btn admin-btn--secondary"
                  onClick={() => setSelectedKonsul(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default ManageKonsultasi
