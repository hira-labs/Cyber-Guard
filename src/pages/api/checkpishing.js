/**
 * @swagger
 * /api/checkpishing:
 *   post:
 *     summary: Generate study notes based on a given topic
 *     description: This endpoint generates study notes using the Google Gemini API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 description: Topic for which to generate notes
 *                 example: Quantum Computing
 *               language:
 *                 type: string
 *                 description: Language in which to generate notes
 *                 example: English
 *     responses:
 *       200:
 *         description: Successfully generated study notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: string
 *                   example: "Notes about Quantum Computing..."
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid or missing topic field."
 *       500:
 *         description: Error generating notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate notes"
 */

import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

// Enhanced phishing detection keywords
const phishingKeywords = [
  "urgent",
  "password",
  "click here",
  "verify",
  "sensitive",
  "login",
  "account suspended",
  "confirm your identity",
  "unauthorized",
  "immediately",
  "update",
  "suspicious",
  "verify your account",
  "discrepancy",
  "personal information",
  "security breach",
  "external link",
  "lose access",
  "immediate action required",
  "temporary hold",
  "reactivate",
  "support team",
];

// Safe/security-related keywords
const safeKeywords = [
  "security instruction",
  "confidential",
  "bank policy",
  "do not share credentials",
  "fraud prevention",
  "safeguard your account",
];

// Enhanced list of known safe domains
const safeDomains = [
  "bank.com",
  "paypal.com",
  "microsoft.com",
  "google.com",
  "amazon.com",
  "apple.com",
];

// Enhanced regex for link detection
const linkRegex =
  /http[s]?:\/\/(?:[a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,6}(\/[^\s]*)?/gi;

// Helper function to extract domain from email address
function extractDomain(emailAddress) {
  const match = emailAddress.match(/@([a-z0-9.-]+)/i);
  return match ? match[1].toLowerCase() : null;
}

// Helper function to check for phishing keywords
function checkForKeywords(content, keywords) {
  return keywords.some((keyword) => content.toLowerCase().includes(keyword));
}

// Helper function to validate links in the email content
function detectSuspiciousLinks(emailContent) {
  const links = emailContent.match(linkRegex) || [];
  return links.some((link) => {
    const domainMatch = link.match(/:\/\/(www\.)?([a-z0-9.-]+\.[a-z]{2,6})/i);
    const domain = domainMatch ? domainMatch[2].toLowerCase() : null;
    return domain && !safeDomains.includes(domain);
  });
}

// Enhanced sender domain validation using a public API
async function isSafeDomain(domain) {
  try {
    const response = await fetch(`https://domain-api.com/check?domain=${domain}`);
    const result = await response.json();
    return result.isSafe || safeDomains.includes(domain);
  } catch (error) {
    console.error("Error validating domain:", error);
    return false; // Default to unsafe if validation fails
  }
}

// GPT-based analysis for sophisticated detection
const MAX_INPUT_LENGTH = 2000;

async function analyzeWithGPT(emailContent) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/gpt2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: emailContent.slice(0, MAX_INPUT_LENGTH) }),
      }
    );

    const result = await response.json();
    return result?.[0]?.generated_text || "";
  } catch (error) {
    console.error("Error with GPT analysis:", error);
    return "Analysis failed.";
  }
}

// Main phishing detection function
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { emailContent, senderEmail } = req.body;

  if (!emailContent || !senderEmail) {
    return res.status(400).json({
      error: "Email content and sender email are required",
    });
  }

  try {
    const senderDomain = extractDomain(senderEmail);
    const isSenderSafe = senderDomain ? await isSafeDomain(senderDomain) : false;

    const hasPhishingKeywords = checkForKeywords(emailContent, phishingKeywords);
    const hasSafeKeywords = checkForKeywords(emailContent, safeKeywords);
    const hasSuspiciousLinks = detectSuspiciousLinks(emailContent);

    const analysis = await analyzeWithGPT(emailContent);

    const phishingScore =
      (hasPhishingKeywords ? 2 : 0) +
      (hasSuspiciousLinks ? 3 : 0) -
      (hasSafeKeywords ? 2 : 0) -
      (isSenderSafe ? 2 : 0);

    const isPhishing = phishingScore > 4;

    return res.status(200).json({
      isPhishing,
      phishingKeywordsDetected: hasPhishingKeywords,
      safeKeywordsDetected: hasSafeKeywords,
      suspiciousLinksDetected: hasSuspiciousLinks,
      senderIsSafe: isSenderSafe,
      senderDomain,
      analysis,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
