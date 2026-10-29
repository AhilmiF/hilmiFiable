import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.routes.js"
import konsultasiRoutes from "./routes/konsultasi.routes.js"
import artikelRoutes from "./routes/artikel.routes.js"
import teamRoutes from "./routes/team.routes.js"
import contactRoutes from "./routes/contact.routes.js"
import galleryRoutes from "./routes/gallery.routes.js"
import positionRoutes from "./routes/position.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// API Health Check
app.get("/api/v1/health", (req, res) => {
  res.json({ success: true, message: "Fiable Law Office Backend API is running smoothly!" })
})

// Routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/konsultasi", konsultasiRoutes)
app.use("/api/v1/artikel", artikelRoutes)
app.use("/api/v1/team", teamRoutes)
app.use("/api/v1/contact", contactRoutes)
app.use("/api/v1/gallery", galleryRoutes)
app.use("/api/v1/position", positionRoutes)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan." })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Internal Error:", err)
  res.status(500).json({ success: false, message: "Terjadi kesalahan internal pada server.", error: err.message })
})

app.listen(PORT, () => {
  console.log(`🚀 Server Benya (Back-End) Fiable berjalan di http://localhost:${PORT}`)
})
