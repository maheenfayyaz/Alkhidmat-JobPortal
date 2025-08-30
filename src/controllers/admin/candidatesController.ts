import { Request, Response } from "express";
import { User } from "../../models/web/User";
import Application from "../../models/web/Application";

// GET /api/admin/candidates
export const getAllCandidates = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { fullname: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const [candidates, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    // Get application count for each candidate
    const candidatesWithStats = await Promise.all(
      candidates.map(async (candidate) => {
        const applicationCount = await Application.countDocuments({ user: candidate._id });
        return {
          ...candidate.toObject(),
          applicationCount
        };
      })
    );

    res.json({
      candidates: candidatesWithStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalCandidates: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/candidates/:id
export const getCandidateDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const candidate = await User.findById(id).select('-password');
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    const applications = await Application.find({ user: id })
      .populate('job', 'title description createdAt')
      .sort({ createdAt: -1 });

    const applicationStats = await Application.aggregate([
      { $match: { user: candidate._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      candidate,
      applications,
      applicationStats
    });
  } catch (error) {
    console.error("Get candidate details error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/candidates/:id/applications
export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const applications = await Application.find({ user: id })
      .populate('job', 'title description company location')
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    console.error("Get candidate applications error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/admin/candidates/:id/status
export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active, suspended, etc.

    const candidate = await User.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).select('-password');

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    res.json({
      message: "Candidate status updated successfully",
      candidate
    });
  } catch (error) {
    console.error("Update candidate status error:", error);
    res.status(500).json({ error: "Server error" });
  }
};