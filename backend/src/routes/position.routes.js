import express from "express"
import { getPositions, createPosition, updatePosition, deletePosition } from "../controllers/position.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

// Public
router.get("/", getPositions)

// Admin
router.post("/admin", verifyToken, createPosition)
router.put("/admin/:id", verifyToken, updatePosition)
router.delete("/admin/:id", verifyToken, deletePosition)

export default router
