import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../util/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";

export async function signup(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (!password || !email || !name) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userAlreadyExists = await prisma.user.findUnique({ where: { email } }); //find user by email


    console.log(userAlreadyExists);

    if (userAlreadyExists) {
        return res.status(400).json({ message: "User already exists", userAlreadyExists });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //hash password with bcrypt
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); //generate random verification token

    console.log("create user");
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    }); //create user with hashed password and verification token

    await generateTokenAndSetCookie(
        res,
        user.id,
    ); //generate token and set cookie with user id

    console.log("send verification email");
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
        message: "User created successfully",
        success: true,
        user: { ...user, password: undefined }
    }) //return user data with password removed
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email" });
        }

        const passwordIsValid = bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const verificationToken = await generateTokenAndSetCookie(res, user.id);

        await prisma.user.update({
            where: { email: email },
            data: {
                lastLogin: new Date(),
                verificationToken: verificationToken,
                verificationTokenExpiresAt: new Date( Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
        });

        

        res.status(200).json({
            message: "Logged in successfully",
            success: true,
            user: { ...user, password: undefined }
        })

    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "login failed" });
    }
}

export async function logout(req, res) {
    try {
        // Clear the authentication token cookie
        res.clearCookie("authToken", {
            httpOnly: true, // Ensures the cookie is only accessible by the server
            secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
            sameSite: "strict", // Prevent cross-site request forgery
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function verifyEmail(req, res) {
    try {
        const email = req.body.email;
        const code = req.body.code;

        if (!email || !code) {
            return res.status(400).json({ message: "Email and code are required" });
        }

        const user = await prisma.user.findFirst({
            where: {
                email: email,
                verificationToken: code,
                verificationTokenExpiresAt: {
                    gte: new Date(), // Check if the token is not expired
                },
            },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or verification code" });
        }

        // Update the user's verification status
        await prisma.user.update({
            where: { email: email },
            data: {
                verificationToken: null,
                verificationTokenExpiresAt: null,
                isVerified: true,
            },
        });

        // Send the welcome email
        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
