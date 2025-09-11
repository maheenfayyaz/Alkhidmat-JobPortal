import { Router } from "express";
import { adminAuthMiddleware } from "../../middlewares/admin/adminAuthMiddleware";

// Dashboard
import { getDashboardStats, getChartData } from "../../controllers/admin/dashboardController";

// Candidates
import { 
  getAllCandidates, 
  getCandidateDetails, 
  getCandidateApplications,
  updateCandidateStatus,
  getCandidateNotes,
  saveCandidateNotes
} from "../../controllers/admin/candidatesController";

// Applications
import { getTotalApplicationsCount, updateApplicationStatus } from "../../controllers/admin/applicationsController";

// Jobs
import { 
  getAllJobs, 
  getJobDetails, 
  updateJobStatus,
  deleteJob,
  createJob
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
  viewResume,
  downloadAllResumes
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

router.get("/candidates/:id/notes", getCandidateNotes);
router.post("/candidates/:id/notes", saveCandidateNotes);

// Applications routes
router.get("/applications/count", getTotalApplicationsCount);
router.patch("/applications/:id/status", updateApplicationStatus);

// Jobs routes
router.get("/jobs", getAllJobs);
router.get("/jobs/:id", getJobDetails);
router.post("/jobs", createJob);
router.patch("/jobs/:id/status", updateJobStatus);
router.delete("/jobs/:id", deleteJob);

// Export routes
router.get("/export/candidates", exportCandidates);
router.get("/export/applications", exportApplications);
router.get("/export/jobs", exportJobs);

// Resume routes
router.get("/resumes/:id/download", downloadResume);
router.get("/resumes/:id/view", viewResume);
/* Temporarily commented out to isolate error
router.get("/resumes/downloadAll", downloadAllResumes);
*/

// Debug route to list resume links
// router.get("/debug/resumes", listResumeLinks);

export default router;
