import express from "express"
import { getGalleries, createGallery, deleteGallery } from "../controllers/gallery.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// Public
router.get("/", getGalleries)

// Admin
router.post("/admin", verifyToken, upload.single("photo"), createGallery)
router.delete("/admin/:id", verifyToken, deleteGallery)

export default router
