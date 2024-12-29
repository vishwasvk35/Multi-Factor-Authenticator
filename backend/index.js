import express from "express"
import cookieParser from "cookie-parser";
import {apiRoutes} from "./routes/authRoutes.js"
import { PrismaClient } from '@prisma/client';
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend's origin
    credentials: true, // Allow credentials
}));

app.use(express.json()); //middleware
app.use(cookieParser()); //middleware to parse cookies

const prisma = new PrismaClient(); // Prisma client instance

app.get('/', (req, res)=>{ // route for root URL
    res.send("Hello world of web dev"); // send response back to client
})

app.use('/api/auth', apiRoutes); // use auth routes for all requests to /api/auth

app.listen(3000, ()=>{
    console.log('backend running on port 3000');
})