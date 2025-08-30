// Import mongoose for ObjectId validation
import { Request, Response } from "express";
import mongoose from "mongoose";
import Application from "../../models/web/Application";
import Job from "../../models/web/Job";

// GET /api/admin/applications
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * limit;

    let query: any = {};
    if (status) {
      query.status = status;
    }

    // Add search filtering in the query
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { "user.fullname": searchRegex },
        { "user.email": searchRegex },
        { "job.title": searchRegex }
      ];
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('user', 'fullname email')
        .populate('job', 'title company location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(query)
    ]);

    res.json({
      applications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalApplications: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/applications/:id
export const getApplicationDetails = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing application ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const application = await Application.findById(id)
      .populate('user', 'fullname email phone')
      .populate('job', 'title description company location requirements');

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ application });
  } catch (error) {
    console.error("Get application details error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/admin/applications/:id/status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Invalid or missing application ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const { status, notes } = req.body; // pending, reviewed, shortlisted, rejected, hired
    const allowedStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes: notes,
        reviewedAt: new Date(),
        reviewedBy: req.user.id
      },
      { new: true }
    ).populate('user', 'fullname email')
     .populate('job', 'title company');

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/applications/by-job/:jobId
export const getApplicationsByJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId;
    if (!jobId || typeof jobId !== "string") {
      return res.status(400).json({ error: "Invalid or missing job ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const applications = await Application.find({ job: jobId })
      .populate('user', 'fullname email phone')
      .sort({ createdAt: -1 });

    const statusCounts = await Application.aggregate([
      { $match: { job: job._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      job,
      applications,
      statusCounts
    });
  } catch (error) {
    console.error("Get applications by job error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
