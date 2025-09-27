import { Router } from "express";
import passport from "passport";

import { signupSchema, loginSchema } from "../../validation/authValidation";
import { validateRequest } from "../../middlewares/web/validateRequest";
import { userAuthMiddleware } from "../../middlewares/web/userAuthMiddleware";
import { signup, login, logout, googleAuth, googleCallback, getMe } from "../../controllers/web/auth.Controller";
import profileRoutes from "./profileRoutes";
import jobRoutes from "./jobRoutes";

const router = Router();

router.post("/signup", validateRequest(signupSchema), signup);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", logout);

// Protected route to get current user
router.get("/me", userAuthMiddleware, getMe);

const hasGoogleAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
    process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here';

console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('hasGoogleAuth:', hasGoogleAuth);

// Google OAuth routes
if (hasGoogleAuth) {
    router.get("/google", googleAuth);
    router.get("/google/callback",
        passport.authenticate('google', { failureRedirect: 'http://localhost:8080/login' }),
        googleCallback
    );
} else {
    // Temporary route to inform user if no Google auth
    router.get("/google", (req, res) => {
        res.status(503).json({ error: "Google authentication not configured. Please contact admin." });
    });
}

// Add profile routes
router.use("/profile", profileRoutes);

// Add job routes
router.use("/jobs", jobRoutes);

export default router;




