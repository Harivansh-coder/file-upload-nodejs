import { Router } from "express";
import {
  getCurrentUserController,
  loginController,
  signupController,
} from "../controllers/auth";
import validateRequestBody from "../middleware/validate";
import { loginSchema, signupSchema } from "../schema/auth";
import { verifyAccessToken } from "../middleware/auth";

const authRouter = Router();

// login route
authRouter.post("/login", validateRequestBody(loginSchema), loginController);

// signup route
authRouter.post("/signup", validateRequestBody(signupSchema), signupController);

// get current logged in user route
authRouter.get("/me", verifyAccessToken, getCurrentUserController);

export default authRouter;
