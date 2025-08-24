  import express, { Application, Request, Response, NextFunction } from "express";
  import dotenv from "dotenv";
  import mongoose from "mongoose";
  import helmet from "helmet";
  import cors from "cors";
  import rateLimit from "express-rate-limit";
  import compression from "compression";
  import morgan from "morgan";
  import { connectDB } from "./config/db";
  import cookieParser from "cookie-parser";


  import authRoutes from "./routes/web/Routes";
  import AdminauthRoutes from "./routes/admin/Routes";



  // Load env vars
  dotenv.config();

  // Validate environment variables
  if (!process.env.MONGO_URI) throw new Error("❌ MONGO_URI is not defined in .env");
  if (!process.env.PORT) throw new Error("❌ PORT is not defined in .env");

  const app: Application = express();

  // Security middleware
  app.use(helmet()); // Secure HTTP headers
  app.use(cors({ origin: "*" })); // You can restrict origin in production
  app.use(compression()); // Gzip compression
  app.use(morgan("dev")); // Logging for dev
  app.use(express.json()); // Parse JSON bodies
  app.use(cookieParser());


  // ... after middleware setup
  app.use("/api/auth", authRoutes);
  app.use("/api/Adminauth", AdminauthRoutes);


  // Rate limiting to prevent brute force attacks
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100, // max requests per IP
    message: "Too many requests from this IP, please try again later.",
  });
  app.use(limiter);

  // Parse JSON bodies
  app.use(express.json({ limit: "10kb" })); // Limit JSON body size


  // Test route
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

  connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
    });
  });

