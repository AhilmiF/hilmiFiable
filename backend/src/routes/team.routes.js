import express from "express"
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/team.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/upload.middleware.js"

const router = express.Router()

// Public routes
router.get("/", getTeamMembers)
router.get("/:id", getTeamMemberById)

// Admin routes (with file upload: photo + portfolio pdf)
router.post("/admin", verifyToken, upload.fields([{ name: "photo", maxCount: 1 }, { name: "portfolio", maxCount: 1 }]), createTeamMember)
router.put("/admin/:id", verifyToken, upload.fields([{ name: "photo", maxCount: 1 }, { name: "portfolio", maxCount: 1 }]), updateTeamMember)
router.delete("/admin/:id", verifyToken, deleteTeamMember)

export default router
