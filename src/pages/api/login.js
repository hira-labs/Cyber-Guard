/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in an existing user
 *     description: Authenticate a user by email and password and return a JWT token if successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT token for authenticated requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     isPhishingAware:
 *                       type: boolean
 *       400:
 *         description: Bad request. Missing fields or invalid credentials.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email and password are required."
 *       401:
 *         description: Unauthorized. Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid password."
 *       404:
 *         description: Not found. User not found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found."
 *       405:
 *         description: Method not allowed. Only POST is allowed for login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Method not allowed."
 */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Cookies from "cookies"; // For setting cookies
import dbConnect from "../../../lib/mongoose"; // Assuming you have a db connection utility
import User from "../../../lib/models/user"; // Assuming Mongoose User model

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({
            success: false,
            message: "Email and password are required.",
          });
        }

        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid password." });
        }

        const token = jwt.sign(
          { _id: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Set cookie using the cookies package
        const cookies = new Cookies(req, res);
        cookies.set("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600 * 1000, // 1 hour
          sameSite: "strict",
          path: "/",
        });

        res.status(200).json({
          success: true,
          message: "Login successful.",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            isPhishingAware: user.isPhishingAware,
          },
        });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case "GET":
      try {
        const cookies = new Cookies(req, res);
        const token = cookies.get("token");

        if (!token) {
          return res
            .status(401)
            .json({ success: false, message: "Not authenticated." });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        }

        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token." });
      }
      break;

    case "DELETE":
      const cookies = new Cookies(req, res);
      cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), // Expire the cookie immediately
        sameSite: "strict",
        path: "/",
      });

      res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
      break;

    default:
      res.status(405).json({ success: false, message: "Method not allowed." });
      break;
  }
}
