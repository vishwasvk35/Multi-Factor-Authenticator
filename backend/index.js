import express from "express"
import cookieParser from "cookie-parser";
import { apiRoutes } from "./routes/authRoutes.js"
import { PrismaClient } from '@prisma/client';
import cors from "cors";
import path from "path";

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV=="development" ? "http://localhost:5173" : "https://advanced-authenticator.netlify.app", // Replace with your frontend's origin
    credentials: true, // Allow credentials
}));

app.use(express.json()); //middleware
app.use(cookieParser()); //middleware to parse cookies

const prisma = new PrismaClient(); // Prisma client instance
const __dirname = path.resolve();

app.use('/api/auth', apiRoutes); // use auth routes for all requests to /api/auth

if (process.env.NODE_ENV == "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist"))); // serve static files from build
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
    });// serve index.html for all other routes
}

app.listen(3000, () => {
    console.log('backend running on port 3000');
})