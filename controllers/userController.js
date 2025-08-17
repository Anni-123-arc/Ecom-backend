// controllers/userController.js
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: user.safeObject() });
  } catch (err) {
    console.error("getProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    // prevent direct password changes here
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpires;

    // check unique email/mobile
    if (updates.email) {
      const ex = await User.findOne({ email: updates.email, _id: { $ne: req.user.id } });
      if (ex) return res.status(409).json({ message: "Email already in use" });
    }
    if (updates.mobile) {
      const ex = await User.findOne({ mobile: updates.mobile, _id: { $ne: req.user.id } });
      if (ex) return res.status(409).json({ message: "Mobile already in use" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    return res.json({ user: user.safeObject() });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) return res.status(400).json({ message: "All fields required" });
    if (newPassword !== confirmPassword) return res.status(400).json({ message: "Passwords do not match" });

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Current password incorrect" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
