import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function authMiddleware(handler) {
    return async (req, res) => {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized." });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            return handler(req, res);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token." });
        }
    };
}