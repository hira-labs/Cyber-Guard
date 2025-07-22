/**
 * @swagger
 * /api/get-passwords:
 *   get:
 *     summary: Retrieve account information along with passwords for a user.
 *     description: This API retrieves account names and hashed passwords associated with a user's email.
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the user whose account details are to be retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved account information.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   accountName:
 *                     type: string
 *                     example: "gmail"
 *                   password:
 *                     type: string
 *                     example: "$2b$10$EXAMPLEHASH"
 *       400:
 *         description: Invalid input (missing email).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Email is required."
 *       404:
 *         description: No accounts found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No accounts found for the specified user."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while retrieving account details."
 */

import dbConnect from "../../../lib/mongoose"; // Database connection utility
import Account from "../../../lib/models/Account"; // Account model

// API handler for retrieving account information
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.query;

  // Validate input
  if (!email || email.trim() === "") {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Connect to the database
    await dbConnect();
    console.log("Database connected successfully");

    // Retrieve account details associated with the email
    const accounts = await Account.find({ email }).select("accountName password");

    if (accounts.length === 0) {
      return res.status(404).json({ message: "No accounts found for the specified user." });
    }

    // Respond with account names and passwords
    res.status(200).json(accounts);
  } catch (error) {
    console.error("Error occurred while retrieving account details:", error);
    return res.status(500).json({ message: "Something went wrong while retrieving account details." });
  }
}
