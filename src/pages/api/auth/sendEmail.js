// /pages/api/sendOtp.js
import nodemailer from "nodemailer";
import crypto from "crypto";
import dbConnect from "../../../../lib/mongoose"; // Replace with your actual DB connection setup
import User from "../../../../lib/models/user"; // Replace with your actual user model

// Get email user and password from environment variables
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525, // Or 25, 465, or 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const OTP_EXPIRY = 5 * 60 * 1000; // OTP expiry time: 5 minutes

export default async function handler(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    // Connect to DB
    await dbConnect();

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Generate OTP code
    const otpCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    console.log(otpCode);

    // Set OTP and expiry time in the database
    user.otp = otpCode;
    user.otpExpiry = Date.now() + OTP_EXPIRY;
    await user.save();

    // Send OTP to user's email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (your email)
      to: email, // Recipient email
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otpCode}`, // OTP text
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ success: false, message: "Error sending OTP" });
      }

      // Respond to user after sending email
      return res
        .status(200)
        .json({ success: true, message: "OTP sent to your email" });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
