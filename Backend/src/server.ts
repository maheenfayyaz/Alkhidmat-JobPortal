import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import morgan from "morgan";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";

dotenv.config();

// Log all env vars for debugging (remove after fix)
console.log('MONGO_URI defined:', !!process.env.MONGO_URI);
console.log('PORT defined:', !!process.env.PORT);
console.log('GOOGLE_CLIENT_ID defined:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET defined:', !!process.env.GOOGLE_CLIENT_SECRET);

// Validate environment variables
if (!process.env.MONGO_URI) throw new Error("❌ MONGO_URI is not defined in .env");
if (!process.env.PORT) throw new Error("❌ PORT is not defined in .env");
if (!process.env.SESSION_SECRET) throw new Error("❌ SESSION_SECRET is not defined in .env");

// Import passport config to register strategies
import './config/passport';

// ✅ Correct route imports (moved after dotenv)
import authRoutes from "./routes/web/Routes";          // signup/login/logout (user)
import adminAuthRoutes from "./routes/admin/Routes";   // admin signup/login/logout
import adminRoutes from "./routes/admin/adminRoutes"; // admin features: jobs, candidates, etc.
import adminProfileRoutes from "./routes/admin/profileRoutes"; // admin profile routes
import jobRoutes from "./routes/web/jobRoutes";       // user jobs
import contactRoutes from "./routes/web/contactRoutes"; // contact form routes

const app: Application = express();

// 🔒 Security middleware

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080"],
  credentials: true
}));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'", "http://localhost:3000"],
      upgradeInsecureRequests: [],
    },
  },
}));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // set to true for https
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files for profile images with CORS headers
import path from "path";
import fs from "fs";

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];

// Route to handle profile image requests with proper CORS
app.get('/uploads/profile_images/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../uploads/profile_images', req.params.filename);

  // Dynamically set CORS headers based on request origin
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  // Remove Access-Control-Allow-Credentials header for image requests to avoid CORS issues
  // res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.set('Access-Control-Max-Age', '86400'); // 24 hours

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Return a default image if the requested image doesn't exist
    const defaultImagePath = path.join(__dirname, '../uploads/profile_images/default-profile.png');
    if (fs.existsSync(defaultImagePath)) {
      res.sendFile(defaultImagePath);
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  }
});

// Serve static files for general uploads folder with CORS headers
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    // Dynamically set CORS headers based on request origin
    const origin = res.req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.set('Access-Control-Allow-Origin', origin);
    }
    // Remove Access-Control-Allow-Credentials header to avoid CORS issues
    // res.set('Access-Control-Allow-Credentials', 'true');
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
