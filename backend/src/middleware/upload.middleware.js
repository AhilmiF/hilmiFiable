import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedImages = /jpeg|jpg|png|webp|gif/
  const allowedDocs = /pdf/
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "")

  if (allowedImages.test(ext) || allowedDocs.test(ext)) {
    cb(null, true)
  } else {
    cb(new Error("Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau PDF."), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})
