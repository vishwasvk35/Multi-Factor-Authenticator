import { Router } from "express"
import * as auth from "../controllers/authController.js"

export const apiRoutes = Router();

apiRoutes.post('/signup', auth.signup);
apiRoutes.post('/login', auth.login)
apiRoutes.post('/logout', auth.logout);
apiRoutes.post('/verify-email', auth.verifyEmail);
apiRoutes.post('/forgot-password', auth.forgotPassword);