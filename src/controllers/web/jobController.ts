import { Request, Response } from "express";
import Job from "../../models/web/Job";
import Application from "../../models/web/Application";

// GET /api/jobs
export const getJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve jobs";
    res.status(500).json({ error: errorMessage });
  }
};

// POST /api/jobs (Admin only)
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const job = new Job({ title, description, createdBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error("Create job error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create job";
    res.status(500).json({ error: errorMessage });
  }
};

// POST /api/jobs/:id/apply
export const applyJob = async (req: Request, res: Response) => {
  try {
    console.log("=== Apply Job Debug ===");
    console.log("Job ID:", req.params.id);
    console.log("User ID:", req.user?.id);
    console.log("Request Body:", req.body);
    
    const { id } = req.params;
    
    // Check authentication
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const { 
      fullName,
      email,
      phone,
      address,
      experience,
      skills,
      currentSalary,
      expectedSalary,
      noticePeriod,
      coverLetter,
      resumeLink,
      portfolioLink
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !experience) {
      return res.status(400).json({ 
        error: "Full name, email, phone, and experience are required" 
      });
    }

    // Check if job exists
    const jobExists = await Job.findById(id);
    if (!jobExists) {
      return res.status(404).json({ error: "Job not found" });
    }

    console.log("Job found:", jobExists.title);

    const application = new Application({
      job: id,
      user: req.user.id,
      fullName,
      email,
      phone,
      address,
      experience,
      skills: skills || [],
      currentSalary,
      expectedSalary,
      noticePeriod,
      coverLetter,
      resumeLink,
      portfolioLink,
      status: 'pending'
    });

    console.log("About to save application...");
    await application.save();
    console.log("Application saved successfully!");

    res.status(201).json({
      message: "Application submitted successfully",
      application
    });
  } catch (error) {
    console.error("❌ Apply job error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({ 
      error: "Failed to submit application", 
      details: errorMessage 
    });
  }
};

// GET /api/applications/me
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const applications = await Application.find({ user: req.user.id })
      .populate("job");
    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve applications";
    res.status(500).json({ error: errorMessage });
  }
};
