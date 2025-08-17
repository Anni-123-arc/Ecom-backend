// routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProfile, updateProfile, changePassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;

