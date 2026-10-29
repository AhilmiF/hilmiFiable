import AdminLayout from "../../../components/admin/AdminLayout"

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-card">
        <h2 className="admin-page-title" style={{ fontStyle: "italic" }}>Welcome Admin!</h2>
        <hr className="admin-dashboard-separator" />
      </div>
    </AdminLayout>
  )
}

export default Dashboard
