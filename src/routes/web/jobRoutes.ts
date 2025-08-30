import { Router } from "express";
import { getJobs, createJob, applyJob, getMyApplications } from "../../controllers/web/jobController";
import { authMiddleware } from "../../middlewares/web/authMiddleware"; // token check

const router = Router();

router.get("/jobs", getJobs);
router.post("/jobs", authMiddleware, createJob); // only admin allowed
router.post("/jobs/:id/apply", authMiddleware, applyJob);
router.get("/applications/me", authMiddleware, getMyApplications);

export default router;
