import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";

// ✅ Correct route imports
import authRoutes from "./routes/web/Routes";          // signup/login/logout (user)
import adminAuthRoutes from "./routes/admin/Routes";   // admin signup/login/logout
import adminRoutes from "./routes/admin/adminRoutes"; // admin features: jobs, candidates, etc.
import adminProfileRoutes from "./routes/admin/profileRoutes"; // admin profile routes
import jobRoutes from "./routes/web/jobRoutes";       // user jobs
import contactRoutes from "./routes/web/contactRoutes"; // contact form routes

// Load env vars
dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) throw new Error("❌ MONGO_URI is not defined in .env");
if (!process.env.PORT) throw new Error("❌ PORT is not defined in .env");

const app: Application = express();

// 🔒 Security middleware

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080"],
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Serve static files for profile images with CORS headers
import path from "path";
app.use('/uploads/profile_images', express.static(path.join(__dirname, '../uploads/profile_images'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
  }
}));

// Serve static files for general uploads folder with CORS headers
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Credentials', 'true');
  }
}));

// 🚏 Routes
app.use("/api/auth", authRoutes);          // User signup/login/logout
app.use("/api/adminauth", adminAuthRoutes); // Admin signup/login/logout
app.use("/api/admin", adminRoutes);        // Admin protected routes
app.use("/api/admin/profile", adminProfileRoutes); // Admin profile routes
app.use("/api/jobs", jobRoutes);           // Jobs for users
app.use("/api/contact", contactRoutes);   // Contact form submissions

// 🛡️ Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// 🧪 Test route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Job Portal API is running..." });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// 🚀 Start server
connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
  });
});

export default app;
