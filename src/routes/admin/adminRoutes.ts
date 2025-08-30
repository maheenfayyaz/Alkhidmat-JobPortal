import { Router } from "express";
import { adminAuthMiddleware } from "../../middlewares/admin/adminAuthMiddleware";

// Dashboard
import { getDashboardStats, getChartData } from "../../controllers/admin/dashboardController";

// Candidates
import { 
  getAllCandidates, 
  getCandidateDetails, 
  getCandidateApplications,
  updateCandidateStatus 
} from "../../controllers/admin/candidatesController";

// Applications
import { 
  getAllApplications, 
  getApplicationDetails, 
  updateApplicationStatus,
  getApplicationsByJob 
} from "../../controllers/admin/applicationsController";

// Jobs
import { 
  getAllJobs, 
  getJobDetails, 
  updateJobStatus,
  deleteJob 
} from "../../controllers/admin/jobsController";

// Export
import { 
  exportCandidates, 
  exportApplications, 
  exportJobs 
} from "../../controllers/admin/exportController";

// Resume
import { 
  downloadResume, 
  viewResume 
} from "../../controllers/admin/resumeController";

const router = Router();

router.use(adminAuthMiddleware);

// Dashboard routes
router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/charts", getChartData);

// Candidates routes
router.get("/candidates", getAllCandidates);
router.get("/candidates/:id", getCandidateDetails);
router.get("/candidates/:id/applications", getCandidateApplications);
router.patch("/candidates/:id/status", updateCandidateStatus);

// Applications routes
router.get("/applications", getAllApplications);
router.get("/applications/:id", getApplicationDetails);
router.patch("/applications/:id/status", updateApplicationStatus);
router.get("/applications/by-job/:jobId", getApplicationsByJob);

// Jobs routes
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobDetails);
router.patch("/jobs/:id/status", updateJobStatus);
router.delete("/jobs/:id", deleteJob);

// Export routes
router.get("/export/candidates", exportCandidates);
router.get("/export/applications", exportApplications);
router.get("/export/jobs", exportJobs);

// Resume routes
router.get("/resumes/:id/download", downloadResume);
router.get("/resumes/:id/view", viewResume);

export default router;