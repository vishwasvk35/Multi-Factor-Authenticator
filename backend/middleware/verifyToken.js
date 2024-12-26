import jsonwebtoken, { decode } from "jsonwebtoken";

export async function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message: "Unauthorized - token not found" });
    }

    try {
        const decoded =  jsonwebtoken.verify(token, process.env.SECRET_KEY)

        if(!decoded){
            return res.status(401).json({ message: "Invalid token" })
        }

        const userId = decoded.userId;
        req.userId = userId;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "error verifying token: " + error.message })
    }
}