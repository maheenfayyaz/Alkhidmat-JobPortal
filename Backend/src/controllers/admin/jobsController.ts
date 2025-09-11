import { Request, Response } from "express";
import Job from "../../models/web/Job";
import Application from "../../models/web/Application";

// GET /api/admin/jobs
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = req.query.search as string || "";
    const skip = (page - 1) * limit;

    let query: any = {};
    if (status) {
      query.status = status;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('createdBy', 'fullname email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query)
    ]);

    // Get application count for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicationCount
        };
      })
    );

    res.json({
      jobs: jobsWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalJobs: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/jobs/:id
export const getJobDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('createdBy', 'fullname email');

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const applicationCount = await Application.countDocuments({ job: id });
    const applications = await Application.find({ job: id })
      .populate('user', 'fullname email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      job,
      applicationCount,
      recentApplications: applications
    });
  } catch (error) {
    console.error("Get job details error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/admin/jobs/:id/status
export const updateJobStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active, inactive, closed

    const job = await Job.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('createdBy', 'fullname email');

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      message: "Job status updated successfully",
      job
    });
  } catch (error) {
    console.error("Update job status error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /api/admin/jobs/:id
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Delete associated applications
    await Application.deleteMany({ job: id });
    
    // Delete job
    await Job.findByIdAndDelete(id);

    res.json({
      message: "Job and associated applications deleted successfully"
    });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/admin/jobs
export const createJob = async (req: Request, res: Response) => {
  try {
    console.log("CreateJob request body:", req.body);  // Added debug log

    const {
      title,
      description,
      location,
      salary,
      status,
      requirements,
      responsibilities,
      department,  
      qualification, 
      type, 
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const newJob = new Job({
      title,
      description,
      location,
      salary,
      status: status || "active",
      requirements,
      responsibilities,
      department,  // Added department field saving
      qualification, // new field saving
      type, // job type saving
      createdBy: req.user._id,  // Set createdBy from authenticated admin user
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newJob.save();

    res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });
  } catch (error) {
    console.error("Create job error:", error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    res.status(500).json({ error: "Server error" });
  }
}
