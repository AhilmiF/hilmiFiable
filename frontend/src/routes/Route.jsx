import { Routes, Route } from "react-router-dom"

// Public pages
import Beranda from "../pages/Beranda"
import Layan from "../pages/Layan"
import Tentang from "../pages/Tentang"
import Partner from "../pages/Partner"
import Consultan from "../pages/Consultan"
import Lawyer from "../pages/Lawyer"
import Kontak from "../pages/Kontak"
import ArtikelPag from "../pages/ArtikelPag"
import Konsul from "../pages/Konsul/Konsul"

// Admin pages
import AdminLogin from "../pages/Admin/Login/AdminLogin"
import Dashboard from "../pages/Admin/Dashboard/Dashboard"
import AddPost from "../pages/Admin/Post/AddPost"
import ManagePost from "../pages/Admin/Post/ManagePost"
import EditPost from "../pages/Admin/Post/EditPost"
import ManageCategory from "../pages/Admin/Category/ManageCategory"
import ManageGallery from "../pages/Admin/Gallery/ManageGallery"
import ManageTeam from "../pages/Admin/Team/ManageTeam"
import AddTeam from "../pages/Admin/Team/AddTeam"
import ManagePosition from "../pages/Admin/Position/ManagePosition"

// Route guard
import ProtectedRoute from "../components/admin/ProtectedRoute"

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Beranda />} />
    <Route path="/tentang-kami" element={<Tentang />} />
    <Route path="/layanan" element={<Layan />} />
    <Route path="/tim-kami/partner-profile" element={<Partner />} />
    <Route path="/tim-kami/legal-consultant-profile" element={<Consultan />} />
    <Route path="/tim-kami/lawyer-profile" element={<Lawyer />} />
    <Route path="/artikel" element={<ArtikelPag />} />
    <Route path="/kontak" element={<Kontak />} />
    <Route path="/konsultasi" element={<Konsul />} />

    {/* Admin - public */}
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Admin - protected */}
    <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/admin/add-post" element={<ProtectedRoute><AddPost /></ProtectedRoute>} />
    <Route path="/admin/manage-post" element={<ProtectedRoute><ManagePost /></ProtectedRoute>} />
    <Route path="/admin/edit-post/:id" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
    <Route path="/admin/manage-category" element={<ProtectedRoute><ManageCategory /></ProtectedRoute>} />
    <Route path="/admin/manage-gallery" element={<ProtectedRoute><ManageGallery /></ProtectedRoute>} />
    <Route path="/admin/manage-team" element={<ProtectedRoute><ManageTeam /></ProtectedRoute>} />
    <Route path="/admin/add-team" element={<ProtectedRoute><AddTeam /></ProtectedRoute>} />
    <Route path="/admin/manage-position" element={<ProtectedRoute><ManagePosition /></ProtectedRoute>} />
  </Routes>
)

export default AppRoutes