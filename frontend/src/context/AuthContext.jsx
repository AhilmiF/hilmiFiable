import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("fiable_admin_token"))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("fiable_admin_user")
    return saved ? JSON.parse(saved) : null
  })

  const login = (tokenValue, userData) => {
    localStorage.setItem("fiable_admin_token", tokenValue)
    localStorage.setItem("fiable_admin_user", JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("fiable_admin_token")
    localStorage.removeItem("fiable_admin_user")
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
