import { Router } from "express";
import multer from "multer";
import { getJobs, createJob, applyJob, getMyApplications, getJobById } from "../../controllers/web/jobController";
import { userAuthMiddleware } from "../../middlewares/web/userAuthMiddleware"; // token check for web users
import { authMiddleware } from "../../middlewares/web/authMiddleware"; // admin token check

const router = Router();

import { Request, Response, NextFunction } from "express";

import fs from "fs";
import path from "path";

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const uploadPath = path.join(__dirname, "../../../uploads/resumes/");
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", authMiddleware, createJob); // only admin allowed
router.post("/:id/apply", userAuthMiddleware, upload.single("resume"), applyJob);
router.get("/applications/me", userAuthMiddleware, getMyApplications);

export default router;
