import express from "express"
import { getContactInfo, updateContactInfo } from "../controllers/contact.controller.js"
import { verifyToken } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/", getContactInfo)
router.put("/admin", verifyToken, updateContactInfo)

export default router
