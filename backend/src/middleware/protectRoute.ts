import jwt, { JwtPayload, JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import prisma from "../db/prisma.js"
import {Request, Response, NextFunction} from "express";

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string;
                username: string;
                fullName: string;
                profilePic: string;
                gender: string;
            }
        }
    }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

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

    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ error: "Unauthorized - Token expired" });
            next(err);
        }

        if (err instanceof JsonWebTokenError) {
            res.status(401).json({ error: "Unauthorized - Invalid token" });
            next(err);
        }

        console.error("Protect route error:", err);
        res.status(500).json({ error: "Internal server error" });
        next(err);
    }
}

export default protectRoute;