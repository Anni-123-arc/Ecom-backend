// controllers/authController.js
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOTPEmail } from "../utils/emailService.js";

dotenv.config();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 15);

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ==================== REGISTER ====================
export const register = async (req, res) => {
  try {
    let { firstName, lastName, email, mobile, password, confirmPassword, role } = req.body;

    // Trim all string inputs to prevent space-only values
    firstName = firstName?.trim();
    lastName = lastName?.trim();
    email = email?.trim();
    mobile = mobile?.trim();
    role = role?.trim();

    // Check for missing fields
    if (!firstName || !lastName || !email || !mobile || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check for existing user
    const exists = await User.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      return res.status(409).json({ message: "Email or mobile already registered" });
    }

    // Hash password & create user
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ firstName, lastName, email, mobile, password: hashed, role });

    // Generate token
    const token = generateToken(user);

    return res.status(201).json({ message: "Registered", user: user.safeObject(), token });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    return res.json({ message: "Logged in", user: user.safeObject(), token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== FORGOT PASSWORD ====================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });

    // Always respond with success message to prevent email enumeration
    if (!user) {
      return res.json({ message: "If an account exists, you will receive an OTP" });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    user.otp = otpHash;
    user.otpExpires = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000);
    await user.save();

    try {
      await sendOTPEmail(email, otp);
    } catch (mailErr) {
      console.warn("Failed to send OTP email:", mailErr.message);
    }

    return res.json({ message: "If an account exists, you will receive an OTP" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== RESET PASSWORD WITH OTP ====================
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) return res.status(400).json({ message: "All fields required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findOne({ email }).select("+otp +otpExpires +password");
    if (!user || !user.otp) return res.status(400).json({ message: "Invalid or expired OTP" });

    // Check if OTP expired
    if (user.otpExpires < new Date()) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify OTP
    const ok = await bcrypt.compare(otp, user.otp);
    if (!ok) return res.status(400).json({ message: "Invalid OTP" });

    // Hash new password and clear OTP
    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPasswordWithOtp error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
