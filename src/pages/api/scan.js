// **swagger**
/**
 * @swagger
 * /api/scan:
 *   post:
 *     tags:
 *       - File Scanning
 *     summary: Scan a PDF file for malware, viruses, and ransomware.
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
 *                 description: The PDF file to be scanned.
 *     responses:
 *       200:
 *         description: Scan result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Result of the scan.
 *       500:
 *         description: Internal server error.
 *       405:
 *         description: Method not allowed.
 */
const express = require('express');
const axios = require('axios');
const formidable = require('formidable');
const fs = require('fs');

const app = express();
const port = 5000;

const VIRUSTOTAL_API_KEY = 'd8becde3e34bd5211917c6f7c3ce6a1ba59ace83ff26886366353a811e647f60'; // Replace with your VirusTotal API key

// Middleware to parse incoming form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/scan', (req, res) => {
  const form = new formidable.IncomingForm();
  
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to parse file' });
    }

    const file = files.file[0]; // Assuming the file key is 'file'
    
    try {
      // Step 1: Upload the file to VirusTotal
      const fileStream = fs.createReadStream(file.filepath);

      const fileUploadResponse = await axios.post(
        'https://www.virustotal.com/api/v3/files',
        fileStream,
        {
          headers: {
            'x-apikey': VIRUSTOTAL_API_KEY,
            'Content-Type': 'application/octet-stream',
          },
        }
      );

      const fileId = fileUploadResponse.data.data.id;

      // Step 2: Check the scan results
      const scanResultResponse = await axios.get(
        `https://www.virustotal.com/api/v3/files/${fileId}`,
        {
          headers: {
            'x-apikey': VIRUSTOTAL_API_KEY,
          },
        }
      );

      res.json(scanResultResponse.data);
    } catch (error) {
      console.error('Error scanning file:', error);
      res.status(500).json({ error: 'Error scanning file' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
