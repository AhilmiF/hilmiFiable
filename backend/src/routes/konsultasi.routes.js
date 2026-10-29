import express from "express"
import { submitKonsultasi, getAllKonsultasi, updateKonsultasiStatus } from "../controllers/konsultasi.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Public route
router.post("/", submitKonsultasi)

// Admin protected routes
router.get("/admin", verifyToken, getAllKonsultasi)
router.patch("/admin/:id", verifyToken, updateKonsultasiStatus)

export default router
