import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import prisma from "../db/prisma.js";
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                profilePic: true,
                gender: true,
            }
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.status(401).json({ error: "Unauthorized - Token expired" });
        }
        if (err instanceof JsonWebTokenError) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }
        console.error("Protect route error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
export default protectRoute;
