/**
 * @swagger
 * /api/register:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Fetch all user records from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       Fname:
 *                         type: string
 *                       Lname:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       age:
 *                         type: number
 *                       isPhishingAware:
 *                         type: boolean
 *                         example: true
 *   post:
 *     summary: Register a new user
 *     description: Sign up a user with enhanced security parameters.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Fname:
 *                 type: string
 *                 example: John
 *               Lname:
 *                 type: string
 *                 example: Doe
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     Fname:
 *                       type: string
 *                     Lname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     age:
 *                       type: number
 *                     isPhishingAware:
 *                       type: boolean
 */
import dbConnect from "../../../lib/mongoose";
import User from "../../../lib/models/user";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, error: "Failed to fetch users." });
      }
      break;

    case "POST":
      try {
        const { Fname, Lname, phone, email, password, confirmPassword, age } = req.body;

        // Validate request payload
        if (!Fname || !Lname || !phone || !email || !password || !confirmPassword || !age) {
          return res.status(400).json({ 
            success: false, 
            message: "All fields are required." 
          });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ 
            success: false, 
            message: "Invalid email format." 
          });
        }

        // Validate phone number
        if (!/^\d{10}$/.test(phone)) {
          return res.status(400).json({ 
            success: false, 
            message: "Phone number must be 10 digits." 
          });
        }

        // Validate password match
        if (password !== confirmPassword) {
          return res.status(400).json({ 
            success: false, 
            message: "Passwords do not match." 
          });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ 
            success: false, 
            message: "User with this email already exists." 
          });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const newUser = await User.create({
          Fname,
          Lname,
          phone,
          email,
          password: hashedPassword,
          age,
        });

        // Return success response
        res.status(201).json({ success: true, data: newUser });

      } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal Server Error." 
        });
      }
      break;

    default:
      res.status(405).json({ 
        success: false, 
        message: "Method not allowed." 
      });
      break;
  }
}
