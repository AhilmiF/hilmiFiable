import AdminSidebar from "./AdminSidebar"
import "../../styles/admin.css"

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
