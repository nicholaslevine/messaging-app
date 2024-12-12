import prisma from "../db/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
export const signup = async (req, res, next) => {
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ error: "Please fill in all fields" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user = await prisma.user.findUnique({
            where: {
                username
            }
        });
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
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
            generateToken(newUser.id, res);
            return res.status(201).json({
                id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        }
        else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    }
    catch (err) {
        console.log("Error in signup controller", err.message);
        next(err);
    }
};
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(400).json({ error: "Invalid user" });
        }
        const passwordsMatch = await bcryptjs.compare(password, user.password);
        if (!passwordsMatch) {
            return res.status(404).json({ error: "Invalid password" });
        }
        generateToken(user.id, res);
        return res.status(200).json({
            id: user.id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
    }
    catch (error) {
        console.error("Error in login controller" + error.message);
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        return res.status(200).json("Logged out successfully");
    }
    catch (err) {
        console.error("Error in logout controller" + err.message);
        next(err);
    }
};
export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });
        if (user) {
            return res.status(200).json({
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                profilePic: user.profilePic
            });
        }
        else {
            return res.status(404).json({ error: "User not found" });
        }
    }
    catch (error) {
        console.error("Error in getMe controller" + error.message);
        next(error);
    }
};
