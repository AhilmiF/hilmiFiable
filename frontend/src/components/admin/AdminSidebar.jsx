import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import fiableLogo from "../../assets/image/logo.svg"

const menuItems = [
  { to: "/admin", label: "Dashboard", icon: "✔", exact: true },
  { to: "/admin/add-post", label: "Add Post", icon: "📄" },
  { to: "/admin/manage-post", label: "Manage Post", icon: "📋" },
  { to: "/admin/manage-category", label: "Manage Category", icon: "📁" },
  { to: "/admin/manage-gallery", label: "Manage Gallery", icon: "🖼" },
  { to: "/admin/manage-team", label: "Manage Team", icon: "👥" },
  { to: "/admin/manage-position", label: "Manage Position", icon: "📊" },
]

const AdminSidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/admin/login")
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__logo">
        <img src={fiableLogo} alt="Fiable Law Office" />
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `admin-sidebar__item${isActive ? " admin-sidebar__item--active" : ""}`
            }
          >
            <span className="admin-sidebar__icon">{item.icon}</span>
            <span className="admin-sidebar__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="admin-sidebar__logout" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}

export default AdminSidebar
