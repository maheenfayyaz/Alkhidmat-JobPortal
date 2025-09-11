import { Request, Response } from "express";
import { User } from "../../models/web/User";
import Application from "../../models/web/Application";

const candidateNotesStore: { [candidateId: string]: string } = {};

// GET /api/admin/candidates
export const getAllCandidates = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || "";
    const skip = (page - 1) * limit;

    // Query for all users with optional search
    let userQuery = {};
    if (search) {
      userQuery = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Fetch all users with pagination
    const [users, totalUsers] = await Promise.all([
      User.find(userQuery)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(userQuery)
    ]);

    // Fetch total applications count matching search (if needed)
    let applicationQuery = {};
    if (search) {
      // Find user IDs matching search to filter applications
      const matchingUserIds = await User.find(userQuery).select('_id');
      applicationQuery = { user: { $in: matchingUserIds.map(u => u._id) } };
    }
    const totalApplications = await Application.countDocuments(applicationQuery);

    // Map users to candidates with application info
    const candidatesWithStats = await Promise.all(
      users.map(async (user) => {
        const applicationCount = await Application.countDocuments({ user: user._id });
        const latestApplication = await Application.findOne({ user: user._id })
          .populate('job')
          .sort({ createdAt: -1 })
          .exec();

        let position = "N/A";
        let status = "N/A";
        let submissionDate = null;
        if (latestApplication) {
          if (latestApplication.job && typeof latestApplication.job !== 'string') {
            const job = latestApplication.job as { title?: string };
            if (job.title) {
              position = job.title;
            }
          }
          status = latestApplication.status || "pending";
          submissionDate = latestApplication.createdAt;
        }

        return {
          ...user.toObject(),
          applicationCount,
          position,
          status,
          submissionDate
        };
      })
    );

    res.json({
      candidates: candidatesWithStats,
      totalCandidates: totalUsers,
      totalApplications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        hasNext: page < Math.ceil(totalUsers / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get candidates error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Other controller functions remain unchanged...

export const getCandidateDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Disable caching for this response
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    const candidate = await User.findById(id).select('-password');
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    // Fetch application info from applications collection
    const application = await Application.findOne({ user: id }).select('fullName phone').exec();

    // Merge candidate and application data, prioritizing User model fields
    const candidateObj = candidate.toObject();
    if (application) {
      candidateObj.fullname = candidateObj.fullname || application.fullName || '';
      candidateObj.phone = candidateObj.phone || application.phone || '';
    } else {
      candidateObj.fullname = candidateObj.fullname || '';
      candidateObj.phone = candidateObj.phone || '';
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
      candidate: candidateObj,
      applications,
      applicationStats
    });
  } catch (error) {
    console.error("Get candidate details error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCandidateApplications = async (req: Request, res: Response) => {
  try {
    const candidateId = req.params.id;
    if (!candidateId) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }
    const applications = await Application.find({ user: candidateId })
      .populate('job', 'title description createdAt')
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    console.error("Get candidate applications error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateCandidateStatus = async (req: Request, res: Response) => {
  try {
    const candidateId = req.params.id;
    const { status } = req.body;
    if (!candidateId || !status) {
      return res.status(400).json({ error: "Candidate ID and status are required" });
    }
    const candidate = await User.findByIdAndUpdate(candidateId, { status }, { new: true });
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    res.json({ message: "Candidate status updated", candidate });
  } catch (error) {
    console.error("Update candidate status error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCandidateNotes = async (req: Request, res: Response) => {
  try {
    const candidateId = req.params.id;
    if (!candidateId) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }
    const notes = candidateNotesStore[candidateId] || "";
    res.json({ notes });
  } catch (error) {
    console.error("Get candidate notes error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const saveCandidateNotes = async (req: Request, res: Response) => {
  try {
    const candidateId = req.params.id;
    const { notes } = req.body;
    if (!candidateId) {
      return res.status(400).json({ error: "Candidate ID is required" });
    }
    candidateNotesStore[candidateId] = notes || "";
    res.json({ message: "Notes saved" });
  } catch (error) {
    console.error("Save candidate notes error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
