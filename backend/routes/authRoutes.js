import { Router } from "express"
import * as auth from "../controllers/authController.js"
import { verifyToken } from "../middleware/verifyToken.js";

export const apiRoutes = Router();

apiRoutes.get('/check-auth', verifyToken, auth.checkAuth);

apiRoutes.post('/signup', auth.signup);
apiRoutes.post('/login', auth.login)
apiRoutes.post('/logout', auth.logout);

apiRoutes.post('/verify-email', auth.verifyEmail);

apiRoutes.post('/forgot-password', auth.forgotPassword);
apiRoutes.post('/reset-password/:token', auth.resetPassword);

