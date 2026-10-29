import express from "express"
import {
  getArtikels,
  getArtikelByIdOrSlug,
  createArtikel,
  updateArtikel,
  deleteArtikel,
} from "../controllers/artikel.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// Public routes
router.get("/", getArtikels)
router.get("/:identifier", getArtikelByIdOrSlug)

// Admin routes (with file upload)
router.post("/admin", verifyToken, upload.single("photo"), createArtikel)
router.put("/admin/:id", verifyToken, upload.single("photo"), updateArtikel)
router.delete("/admin/:id", verifyToken, deleteArtikel)

export default router
