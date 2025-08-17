// models/userModel.js
import mongoose from "mongoose";
import AddressSchema from "./addressModel.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false }, // exclude by default
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otp: { type: String, select: false }, // OTP for forgot password
    otpExpires: { type: Date },
    addresses: [AddressSchema]
  },
  { timestamps: true }
);

// remove sensitive fields when returning to client
UserSchema.methods.safeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  return obj;
};

// Prevent OverwriteModelError by reusing existing model if it exists
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
