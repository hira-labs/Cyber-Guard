import dbConnect from "../../../../lib/mongoose"; // Database connection
import Student from "../../../../lib/models/Student"; // Student model

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Add a new student
 *     description: Create a new student document in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               age:
 *                 type: number
 *                 example: 22
 *               grade:
 *                 type: string
 *                 example: "B"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *     responses:
 *       201:
 *         description: Student created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "648abc123456def789012345"
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                     age:
 *                       type: number
 *                       example: 22
 *                     grade:
 *                       type: string
 *                       example: "B"
 *                     email:
 *                       type: string
 *                       example: "jane.doe@example.com"
 *       400:
 *         description: Error creating student.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 *     default:
 *       description: Method not allowed.
 */

export default async function handler(req, res) {
  // Only handle POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ success: false, error: 'Database connection error' });
  }

  try {
    // Validate the request body
    const { name, age, grade, email } = req.body;
    if (!name || !age || !grade || !email) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Create new student document
    const student = await Student.create(req.body);
    return res.status(201).json({ success: true, data: student });
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(400).json({ success: false, error: 'Error creating student' });
  }
}
