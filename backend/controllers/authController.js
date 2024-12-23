import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookie } from "../util/generateTokenAndSetCookie.js";

export async function signup(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (!password || !email || !name) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userAlreadyExists = await prisma.user.findUnique({ where: { email } });

    
    console.log(userAlreadyExists);

    if (userAlreadyExists) {
        return res.status(400).json({ message: "User already exists", userAlreadyExists } );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(10000 + Math.random() * 90000).toString();
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });

    generateTokenAndSetCookie(
        res,
        user.id,
    );

    res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {...user, password:undefined}
    })
}

export async function login(req, res) {
    res.send("login");
}

export async function logout(req, res) {
    res.send("logout");
}