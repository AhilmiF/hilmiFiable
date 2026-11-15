import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext"
import fiableLogo from "../../../assets/image/logo.svg"

const API = "http://localhost:5000/api/v1"

const AdminLogin = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        login(data.data.token, data.data.user)
        navigate("/admin")
      } else {
        setError(data.message || "Login gagal. Periksa kembali kredensial Anda.")
      }
    } catch {
      setError("Tidak dapat terhubung ke server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div>
        <h1 className="admin-login-title">LOGIN</h1>
        <div className="admin-login-card">
          <div className="admin-login-logo">
            <img src={fiableLogo} alt="Fiable Law Office" />
          </div>
          {error && <div className="admin-login-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="admin-login-input-wrap">
              <span className="input-icon">👤</span>
              <input
                type="email"
                placeholder="Username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="admin-login-input-wrap">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? "Memproses..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
