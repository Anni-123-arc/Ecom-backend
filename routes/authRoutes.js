// routes/authRoutes.js
import express from "express";
import { body } from "express-validator";
import { register, login, forgotPassword, resetPasswordWithOtp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",
  body("firstName").notEmpty(),
  body("lastName").notEmpty(),
  body("email").isEmail(),
  body("mobile").notEmpty(),
  body("password").isLength({ min: 6 }),
  body("confirmPassword").notEmpty(),
  register
);

router.post("/login",
  body("email").isEmail(),
  body("password").notEmpty(),
  login
);

router.post("/forgot-password",
  body("email").isEmail(),
  forgotPassword
);

router.post("/reset-password",
  body("email").isEmail(),
  body("otp").notEmpty(),
  body("newPassword").isLength({ min: 6 }),
  body("confirmPassword").notEmpty(),
  resetPasswordWithOtp
);

export default router;
