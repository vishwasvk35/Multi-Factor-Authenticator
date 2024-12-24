import { Router } from "express"
import * as auth from "../controllers/authController.js"

export const apiRoutes = Router();

apiRoutes.post('/signup', auth.signup);
apiRoutes.post('/login', auth.login)
apiRoutes.post('/logout', auth.logout);
apiRoutes.post('/verifyEmail', auth.verifyEmail);