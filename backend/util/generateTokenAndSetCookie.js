import jwt from "jsonwebtoken"

export async function generateTokenAndSetCookie(res, userId) {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {expiresIn: "7d"} );

    res.cookie(
        "token",
        token,
        {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        }
    )

    return token;
}