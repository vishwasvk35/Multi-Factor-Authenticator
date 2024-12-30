import bcrypt from "bcryptjs"

import { generateTokenAndSetCookie } from "../util/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendResetEmail, sendResetSuccessEmail } from "../mailtrap/email.js";
import jsonwebtoken, { decode } from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function signup(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (!password || !email || !name) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    try {

        const userAlreadyExists = await prisma.user.findUnique({ where: { email } }); //find user by email


        console.log(userAlreadyExists);

        if (userAlreadyExists) {
            return res.status(409).json({ message: "User already exists", userAlreadyExists });
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
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
}

export async function login(req, res) {
    console.log("authcontroller")
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
                verificationTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
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
        res.clearCookie("token", {
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
        const code = req.body.verificationCode;
        if (!code) {
            return res.status(400).json({ message: "verification code is not enterted" });
        }

        const token = req.cookies.token;
        const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
        const userId = decoded.userId;


        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        console.log(user);

        if(user.isVerified){
            return res.status(409).json({ message: "user is already verified" });
        }

        if(!user.verificationToken == code || ! user.verificationTokenExpiresAt >=  new Date()){
            return res.status(409).json({ message: "Invalid email or verification code" });
        }

        // Update the user's verification status
        await prisma.user.update({
            where: { id: userId },
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

export async function forgotPassword(req, res) {
    const email = req.body.email;

    try {
        // Check if the user exists
        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        // Generate a reset token
        const resetToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random token
        const resetTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 1 hour

        // Update the user record with the reset token and expiration
        await prisma.user.update({
            where: { email: email },
            data: {
                resetPasswordToken: resetToken,
                resetPasswordExpiresAt: resetTokenExpiresAt,
            },
        });

        // Send the reset email
        await sendResetEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ message: "Reset email sent successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function resetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const currUser = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpiresAt: { gte: new Date() }
            }
        });

        console.log(token, currUser);

        if (!currUser) {
            return res.status(404).json({ message: "reset token is invalid or has expired" });
        }

        const email = currUser.email;
        console.log(email);
        const newPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { email: email },
            data: {
                password: newPassword,
                resetPasswordToken: undefined,
                resetPasswordExpiresAt: undefined,
            },
        });

        await sendResetSuccessEmail(currUser.email);

        res.status(200).json({ success: true, message: "password reset successfully" });
    } catch (error) {
        console.error("Error during password reset:", error);
        res.status(401).json({ success: false, message: `cannot reset password: ${error}` });
    }
}

export async function checkAuth(req, res) {
    try {
        const userId = req.userId;

        const user = await prisma.user.findFirst({ where: { id: userId } });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user: {
                ...user,
                password: undefined
            }
        });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false, message: "error fetching user" });
    }
}