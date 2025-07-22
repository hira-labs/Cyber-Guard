/**
 * @swagger
 * /api/check-ip:
 *   post:
 *     summary: Check IP reputation using AbuseIPDB
 *     description: This endpoint checks the reputation of an IP address using the AbuseIPDB API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ip:
 *                 type: string
 *                 description: The IP address to check
 *                 example: 192.168.1.1
 *     responses:
 *       200:
 *         description: Successfully retrieved IP reputation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Details about the IP address reputation
 *                   properties:
 *                     ipAddress:
 *                       type: string
 *                       description: The checked IP address
 *                       example: 192.168.1.1
 *                     abuseConfidenceScore:
 *                       type: integer
 *                       description: Confidence score of the IP being abusive
 *                       example: 75
 *                     countryCode:
 *                       type: string
 *                       description: Country code of the IP address
 *                       example: US
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid IP address"
 *       405:
 *         description: Method Not Allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Method Not Allowed"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 */

import axios from 'axios';

const ABUSEIPDB_API_KEY = '618bccdde464689312ea47b2e5436f49561272b4c2f09535f3ff623d8d20253b0e9eeafb18b06983';
const ABUSEIPDB_BASE_URL = 'https://api.abuseipdb.com/api/v2/check';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { ip } = req.body;

  // Validate input
  if (!ip || !/^([0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip)) {
    return res.status(400).json({ message: 'Invalid IP address' });
  }

  try {
    // Make a request to AbuseIPDB
    const response = await axios.get(ABUSEIPDB_BASE_URL, {
      headers: {
        Key: ABUSEIPDB_API_KEY,
        Accept: 'application/json',
      },
      params: { ipAddress: ip, maxAgeInDays: 90 },
    });

    // Return the API response
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.errors?.[0]?.detail || 'Something went wrong',
    });
  }
}
