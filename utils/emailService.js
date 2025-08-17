// utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// verify transporter once at startup (optional)
transporter.verify().then(() => {
  console.log("Email transporter ready");
}).catch(err => {
  console.warn("Email transporter warning:", err.message);
});

export const sendOTPEmail = async (to, otp) => {
  const subject = "Your OTP to reset password";
  const text = `Your OTP is ${otp}. It will expire in ${process.env.OTP_EXPIRES_MINUTES || 15} minutes.`;
  const html = `<p>Your OTP is <b>${otp}</b>.</p><p>It will expire in ${process.env.OTP_EXPIRES_MINUTES || 15} minutes.</p>`;

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
  return info;
};
