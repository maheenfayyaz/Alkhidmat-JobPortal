import { Router } from "express";

import { signupSchema, loginSchema } from "../../validation/authValidation";
import { validateRequest } from "../../middlewares/web/validateRequest";
import { signup, login, logout } from "../../controllers/web/auth.Controller";


const router = Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);
export default router;
    

