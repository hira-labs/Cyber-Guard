import jwt from "jsonwebtoken";
import dbConnect from "../../../../lib/mongoose";
import User from "../../../../lib/models/user";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed." });
  }

  await dbConnect();

  const token = req.cookies.token; 
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    const user = await User.findById(decoded._id); 
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.Fname,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
}