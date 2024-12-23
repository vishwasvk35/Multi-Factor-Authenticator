import express from "express"
import {apiRoutes} from "./routes/authRoutes.js"
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.get('/', (req, res)=>{
    res.send("Hello world of web dev");
})

app.use('/api/auth', apiRoutes); //create multiple api routes like signup, login, signin

app.listen(3000, ()=>{
    console.log('backend running on port 3000');
})