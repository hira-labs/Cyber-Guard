/**
 * @swagger
 * /api/url-check:
 *   post:
 *     summary: Evaluate URL Reputation
 *     description: Takes a URL, resolves its IP address, and checks if it is safe or malicious using AbuseIPDB.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL to evaluate.
 *                 example: "http://example.com"
 *     responses:
 *       200:
 *         description: Reputation check result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ip:
 *                   type: string
 *                   description: Resolved IP address.
 *                 isMalicious:
 *                   type: boolean
 *                   description: Indicates if the IP is malicious.
 *                 confidenceScore:
 *                   type: integer
 *                   description: Abuse confidence score (0-100).
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Categories of abuse reported.
 *                 message:
 *                   type: string
 *                   description: Reputation summary message.
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or missing URL."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while processing the request."
 */
import axios from "axios";
import dns from "dns/promises";
import { URL } from "url";

const ABUSEIPDB_API_KEY = '618bccdde464689312ea47b2e5436f49561272b4c2f09535f3ff623d8d20253b0e9eeafb18b06983';
const ABUSEIPDB_BASE_URL = "https://api.abuseipdb.com/api/v2/check";

// Function to check IP reputation via AbuseIPDB
async function checkIPReputation(ipAddress) {
  try {
    const response = await axios.get(ABUSEIPDB_BASE_URL, {
      headers: {
        Key: ABUSEIPDB_API_KEY,
        Accept: "application/json",
      },
      params: { ipAddress },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error querying AbuseIPDB:", error.response?.data || error.message);
    throw new Error("Failed to query AbuseIPDB.");
  }
}

// API handler for URL reputation check
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required." });
  }

  try {
    // Parse and validate the URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (err) {
      return res.status(400).json({ message: "Invalid URL format." });
    }

    // Validate the domain name format before resolving
    const hostname = parsedUrl.hostname;
    if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) {
      return res.status(400).json({ message: "Invalid domain format." });
    }

    // Resolve the IP address from the hostname
    let ipAddress;
    try {
      [ipAddress] = await dns.resolve4(hostname);
      console.log(`Resolved IP address: ${ipAddress}`);
    } catch (err) {
      return res.status(400).json({ message: "Unable to resolve IP address." });
    }

    // Check the IP's reputation using AbuseIPDB
    const reputationData = await checkIPReputation(ipAddress);

    // Determine if the IP is malicious based on the abuse confidence score
    const isMalicious = reputationData.abuseConfidenceScore > 50;

    // Respond with the results
    res.status(200).json({
      ip: ipAddress,
      isMalicious,
      confidenceScore: reputationData.abuseConfidenceScore,
      categories: reputationData.categories?.map((cat) => cat.categoryName) || [],
      message: isMalicious
        ? "The IP address is considered malicious."
        : "The IP address is considered safe.",
    });
  } catch (error) {
    console.error("Error processing URL:", error.message);
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
}
