import { Router } from "express";

import { signupSchema, loginSchema } from "../../validation/authValidation";
import { validateRequest } from "../../middlewares/web/validateRequest";
import { signup, login, logout } from "../../controllers/web/auth.Controller";
import profileRoutes from "./profileRoutes";
import jobRoutes from "./jobRoutes";

const router = Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

// Add profile routes
router.use("/profile", profileRoutes);

// Add job routes
router.use("/jobs", jobRoutes);

export default router;
    
    
    

