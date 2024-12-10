import {Request, Response} from "express"
import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs"
import generateToken from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
    try {
        const {fullName, username, password, confirmPassword, gender} = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({error: "Please fill in all fields"})
        }

        if (password !== confirmPassword) {
            return res.status(400).json({error: "Passwords don't match"})
        }

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if (user) {
            return res.status(400).json({error: "Username already exists"});
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        
        const newUser = await prisma.user.create({
            data: {
                fullName,
                username,
                password: hashedPassword,
                gender,
                profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
            }
        });

        if (newUser) {
            generateToken(newUser.id, res)

            res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        } else {
            res.status(400).json({error: "Invalid user data"})
        }

    } catch(err: any) {
        console.log("Error in signup controller", err.message);
        res.status(500).json({error: "Internal server error"})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (!user) {
            return res.status(400).json({error: "Invalid user"});
        }

        const passwordsMatch = await bcryptjs.compare(password, user.password);
        if (!passwordsMatch) {
            return res.status(404).json({error: "Invalid password"})
        }

        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username, // Fixed typo
            profilePic: user.profilePic
        })

    } catch (error: any) {
        console.error("Error in login controller" + error.message);
        res.status(500).json({error: "Internal server error"})
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json("Logged out successfully");
    } catch(err: any) {
        console.error("Error in logout controller" + err.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });
        
        if (user) {
            res.status(200).json({
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                profilePic: user.profilePic
            });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error: any) {
        console.error("Error in getMe controller" + error.message);
        res.status(500).json({error: "Internal server error"});
    }
};