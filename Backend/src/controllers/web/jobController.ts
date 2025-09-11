import { Request, Response } from "express";
import Job from "../../models/web/Job";
import Application from "../../models/web/Application";

// GET /api/jobs
export const getJobs = async (req: Request, res: Response) => {
  try {
    const { search, location, department, type } = req.query;

    // Build filter object based on query params
    const filter: any = {};

    if (search && typeof search === 'string') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location && typeof location === 'string' && location.toLowerCase() !== 'all') {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (department && typeof department === 'string' && department.toLowerCase() !== 'all') {
      filter.department = { $regex: department, $options: 'i' };
    }

    if (type && typeof type === 'string' && type.toLowerCase() !== 'all') {
      filter.type = { $regex: type, $options: 'i' };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    // Map _id to id for frontend compatibility and include new fields
    const jobsWithId = jobs.map(job => ({
      id: job._id,
      title: job.title,
      description: job.description,
      createdBy: job.createdBy,
      createdAt: job.createdAt,
      company: (job as any).company || "",
      location: (job as any).location || "",
      department: (job as any).department || "",
      type: (job as any).type || "",
      posted: (job as any).posted || ""
    }));

    res.json(jobsWithId);
  } catch (error) {
    console.error("Get jobs error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve jobs";
    res.status(500).json({ error: errorMessage });
  }
};

// POST /api/jobs (Admin only)
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, company, location, department, type, posted } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }
    
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const job = new Job({ title, description, company, location, department, type, posted, createdBy: req.user.id });
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
    
    // Multer stores form fields in req.body and file info in req.file
    // But if multer is not configured correctly, req.body may be undefined
    // To fix, ensure multer middleware is applied before this handler

    // If req.body is undefined, parse form-data manually or fix multer setup
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    const { 
      fullName,
      email,
      phone,
      address,
      experience,
      skills,
      coverLetter,
      portfolioLink
    } = req.body;

    // Get resume file path from multer
    const resumeLink = req.file ? req.file.path : "";

    // Validate required fields
    if (!fullName || !email || !phone) {
      return res.status(400).json({ 
        error: "Full name, email, and phone are required" 
      });
    }

    // Check if job exists
    const jobExists = await Job.findById(id);
    if (!jobExists) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Check if job is inactive
    if (jobExists.status && jobExists.status.toLowerCase() === "inactive") {
      return res.status(400).json({ error: "Cannot apply to an inactive job" });
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
      skills,
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
    if (error instanceof Error) {
      console.error(error.stack);
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    res.status(500).json({ 
      error: "Failed to submit application", 
      details: errorMessage 
    });
  }
};

export const getMyApplications = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const applications = await Application.find({ user: req.user.id })
      .populate("job");
    
    // Convert interviewDate to ISO format if present
    const applicationsWithFormattedDate = applications.map(app => {
      if (app.interviewDate) {
        // Try to parse interviewDate as a string in "DD-MM-YYYY" or "DD/MM/YYYY" format
        const dateParts = app.interviewDate.split(/[-\/]/);
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          const isoDate = new Date(`${year}-${month}-${day}`);
          app.interviewDate = isoDate.toISOString();
        }
      }
      return app;
    });

    res.json(applicationsWithFormattedDate);
  } catch (error) {
    console.error("Get applications error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve applications";
    res.status(500).json({ error: errorMessage });
  }
};

  
  
// GET /api/jobs/:id
import mongoose from "mongoose";

export const getJobById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate id presence and format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid or missing job ID" });
    }

    const job = await Job.findById(id).populate('createdBy', 'companyName');
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    // Map _id to id for frontend compatibility
    const jobWithId = {
      id: job._id,
      title: job.title,
      description: job.description,
      createdBy: (job.createdBy as any)?.companyName || "",
      createdAt: job.createdAt,
      location: (job as any).location || "",
      department: (job as any).department || "",
      type: (job as any).type || "",
      posted: (job as any).posted || "",
      status: (job as any).status || "active",
      responsibilities: ((job as any).responsibilities ? (job as any).responsibilities.split('\n') : []),
      qualifications: ((job as any).qualifications ? (job as any).qualifications.split('\n') : []),
      requirements: ((job as any).requirements ? (job as any).requirements.split('\n') : []),
    };
    res.json(jobWithId);
  } catch (error) {
    console.error("Get job by ID error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to retrieve job";
    res.status(500).json({ error: errorMessage });
  }
};
