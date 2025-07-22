/**
 * @swagger
 * /api/suggest-password:
 *   post:
 *     summary: Suggest a strong password for a given account name.
 *     description: This API generates a strong password for a given account name with additional customizable parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 description: The account name for which to generate the password.
 *                 example: "gmail"
 *               length:
 *                 type: integer
 *                 description: The desired length of the password (default is 16).
 *                 example: 12
 *               strength:
 *                 type: string
 *                 description: The strength of the password. Options are 'weak', 'medium', or 'strong' (default is 'strong').
 *                 example: "strong"
 *               includeSpecialChars:
 *                 type: boolean
 *                 description: Whether to include special characters in the password (default is true).
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully generated password suggestion.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Suggested password generated for account 'gmail'."
 *                 suggestedPassword:
 *                   type: string
 *                   description: The suggested password generated.
 *                   example: "g!9KmB9#3Df$X8"
 *       400:
 *         description: Invalid input (missing account name).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account name is required."
 */
import bcrypt from "bcryptjs";

// Generate a strong password based on parameters
function generateStrongPassword(length = 16, strength = 'strong', includeSpecialChars = true) {
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (includeSpecialChars) {
    charset += "!@#$%^&*()_+";
  }

  // Adjust password complexity based on strength
  if (strength === 'medium') {
    charset = charset.slice(0, charset.length - 10);  // Exclude special chars for medium strength
  } else if (strength === 'weak') {
    charset = charset.slice(0, charset.length - 20);  // Exclude special chars and numbers for weak strength
  }

  return Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join("");
}

// API handler for password suggestion
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { accountName, length, strength, includeSpecialChars } = req.body;

  if (!accountName || accountName.trim() === "") {
    return res.status(400).json({ message: "Account name is required." });
  }

  try {
    // Set default values if not provided
    const passwordLength = length || 16;
    const passwordStrength = strength || 'strong';
    const includeSpecial = includeSpecialChars !== undefined ? includeSpecialChars : true;

    // Generate the suggested password
    const password = generateStrongPassword(passwordLength, passwordStrength, includeSpecial);

    res.status(200).json({
      message: `Suggested password generated for account '${accountName}'.`,
      suggestedPassword: password,
    });
  } catch (error) {
    console.error("Error generating suggested password:", error);
    return res.status(500).json({ message: "Something went wrong while generating the password." });
  }
}
