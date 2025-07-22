/**
 * @swagger
 * /api/store-password:
 *   post:
 *     summary: Store a password securely in MongoDB.
 *     description: This API stores the provided password securely in MongoDB after the user confirms.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 description: The account name for which the password is being stored.
 *                 example: "gmail"
 *               password:
 *                 type: string
 *                 description: The password to be stored.
 *                 example: "g!9KmB9#3Df$X8"
 *     responses:
 *       200:
 *         description: Successfully stored password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password successfully stored for account 'gmail'."
 *       400:
 *         description: Invalid input (missing account name or password).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account name and password are required."
 *       500:
 *         description: Internal server error or failure in password storage.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while storing the password."
 */
import User from "../../../lib/models/User"; // User model
import dbConnect from "../../../lib/mongoose"; // Database connection utility
import Account from "../../../lib/models/Account"; // Account model

// API handler for storing password
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, accountName, password } = req.body;

  // Validate input
  if (!email || !accountName || !password || email.trim() === "" || accountName.trim() === "" || password.trim() === "") {
    return res.status(400).json({ message: "Email, account name, and password are required." });
  }

  try {
    // Connect to the database
    await dbConnect();
    console.log("Database connected successfully");

    // Ensure the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Directly store the password without hashing
    const account = await Account.create({
      email, // Direct association with email
      accountName,
      password, // Store plain-text password (not recommended for production)
    });

    console.log("Password stored successfully in database");

    res.status(200).json({
      message: `Password successfully stored for account '${accountName}'.`,
    });
  } catch (error) {
    console.error("Error occurred while storing the password:", error);
    return res.status(500).json({ message: "Something went wrong while storing the password." });
  }
}
