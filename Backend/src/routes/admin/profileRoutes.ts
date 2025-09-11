import { Router } from "express";
import { getAdminProfile, updateAdminProfile } from "../../controllers/admin/adminProfileController";
import { adminAuthMiddleware } from "../../middlewares/admin/adminAuthMiddleware";
import multer from "multer";
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

router.get("/", adminAuthMiddleware, getAdminProfile);
router.put("/", adminAuthMiddleware, upload.single("profileImage"), updateAdminProfile);

export default router;
