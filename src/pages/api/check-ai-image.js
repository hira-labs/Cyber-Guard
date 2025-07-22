// **Swagger Documentation**
/**
 * @swagger
 * /api/check-ai-image:
 *   post:
 *     tags:
 *       - Image Detection
 *     summary: Detect if the image is AI-generated or not.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The image file to be tested for AI generation.
 *     responses:
 *       200:
 *         description: AI detection result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Result of the detection (whether the image is AI-generated or not).
 *       500:
 *         description: Internal server error.
 *       405:
 *         description: Method not allowed.
 */

// Import necessary modules
import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import axios from "axios";
import fs from "fs";

// Detect AI-generated image using SightEngine API
const detectAIImage = async (filePath) => {
  const formData = new FormData();
  formData.append("media", fs.createReadStream(filePath));
  formData.append("models", "genai");
  formData.append("api_user", "1917366535"); // Replace with your actual API user
  formData.append("api_secret", "e2gDSRMUT2ihaUGBjpybyWLv3ZHQvCQL"); // Replace with your actual API secret

  try {
    const response = await axios.post("https://api.sightengine.com/1.0/check.json", formData, {
      headers: formData.getHeaders(),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const file = formData.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name.replaceAll(" ", "_");
  const filePath = path.join(process.cwd(), "public/assets", filename);

  try {
    // Save the uploaded file to disk
    await writeFile(filePath, buffer);

    // Detect if the image is AI-generated
    const detectionResult = await detectAIImage(filePath);

    // Clean up by removing the file after detection
    fs.unlinkSync(filePath);

    // Return the detection result
    return NextResponse.json({ result: detectionResult, status: 200 });
  } catch (error) {
    console.log("Error occurred:", error);
    // Clean up in case of error
    fs.unlinkSync(filePath);
    return NextResponse.json({ message: "Failed", error: error.message, status: 500 });
  }
};
