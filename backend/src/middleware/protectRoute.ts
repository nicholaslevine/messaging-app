import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma.js"
import {Request, Response, NextFunction} from "express";

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare global{
    namespace Express{
        export interface Request {
            user: {
                id: string,
            }
        }
    }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) : Promise<Response | void> => {
    try {
       const token = req.cookies.jwt;
       if (!token){
        return res.status(401).json({error: "Unathorized - No token provided"});
       }

       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

       if (!decoded){
        return res.status(404).json({error: "Unathorized - Invalid User"});
        }

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
        })

        if (!user){
            return res.status(404).json({error: "Invalid username"});
        }
        req.user = user;


        next()
    } catch (err : any) {
        console.error(err.message)
       return res.status(500).json({error: "Internal server error"}) 
    }
}

export default protectRoute;