import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Akses ditolak. Token tidak ditemukan." })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fiable_law_office_secret_key_2026")
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ success: false, message: "Token tidak valid atau telah kedaluwarsa." })
  }
}
