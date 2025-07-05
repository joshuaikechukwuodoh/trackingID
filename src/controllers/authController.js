import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing username or password" });
        }
        // Query by name (not username)
        const admin = await prisma.admin.findUnique({
            where: { name: username }
        });
        if (!admin) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // Compare password with bcrypt
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // Generate JWT token
        const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


    