import { Router } from "express";
import multer from "multer";
import { getProfile, updateProfile } from "../../controllers/web/profileController";
import { userAuthMiddleware } from "../../middlewares/web/userAuthMiddleware";
import path from "path";
import fs from "fs";

const router = Router();

// Multer setup for profile image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../../uploads/profile_images");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `profile_${uniqueSuffix}${ext}`);
  }
});
const upload = multer({ storage: storage });

router.get("/", userAuthMiddleware, getProfile);
router.put("/", userAuthMiddleware, upload.single("profileImage"), updateProfile);

export default router;
