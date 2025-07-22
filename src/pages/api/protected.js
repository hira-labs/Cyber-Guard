import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];  // Extract token

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    // Token is valid, continue processing
    res.status(200).json({ message: 'Protected data', data: decoded });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
