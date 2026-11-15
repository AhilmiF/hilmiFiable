const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/v1` 
  : "http://localhost:5000/api/v1"

export const getFileUrl = (path) => {
  if (!path) return ""
  if (path.startsWith("http://") || path.startsWith("https://")) return path
  const base = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
    : "http://localhost:5000"
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

/**
 * Submit consultation request form to backend API
 */
export const submitKonsultasiForm = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/konsultasi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    return await response.json()
  } catch (error) {
    console.error("API Error - submitKonsultasiForm:", error)
    return { success: false, message: "Gagal terhubung ke server. Periksa koneksi Anda." }
  }
}

/**
 * Fetch list of articles from backend API
 */
export const fetchArtikels = async (search = "") => {
  try {
    const query = search ? `?search=${encodeURIComponent(search)}` : ""
    const response = await fetch(`${API_BASE_URL}/artikel${query}`)
    return await response.json()
  } catch (error) {
    console.error("API Error - fetchArtikels:", error)
    return { success: false, data: [] }
  }
}

/**
 * Fetch team members from backend API, optionally filtered by category
 */
export const fetchTeamMembers = async (category = "") => {
  try {
    const query = category ? `?category=${encodeURIComponent(category)}` : ""
    const response = await fetch(`${API_BASE_URL}/team${query}`)
    return await response.json()
  } catch (error) {
    console.error("API Error - fetchTeamMembers:", error)
    return { success: false, data: [] }
  }
}

/**
 * Fetch contact info from backend API
 */
export const fetchContactInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`)
    return await response.json()
  } catch (error) {
    console.error("API Error - fetchContactInfo:", error)
    return { success: false, data: null }
  }
}

export default {
  submitKonsultasiForm,
  fetchArtikels,
  fetchTeamMembers,
  fetchContactInfo,
  getFileUrl,
}
