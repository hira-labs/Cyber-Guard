// pages/api/dummy.js

/**
 * @swagger
 * /api/dummy:
 *   get:
 *     summary: Get a dummy message
 *     description: Returns a dummy message with success status
 *     responses:
 *       200:
 *         description: A dummy message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hello, this is a dummy API response"
 *                 success:
 *                   type: boolean
 *                   example: true
 */
export default function handler(req, res) {
    res.status(200).json({
      message: "Hello, this is a dummy API response",
      success: true
    });
  }
  