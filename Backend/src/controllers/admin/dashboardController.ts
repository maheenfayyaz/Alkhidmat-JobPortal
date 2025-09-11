import { Request, Response } from "express";
import Job from "../../models/web/Job";
import Application from "../../models/web/Application";
import { User } from "../../models/web/User";

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalJobs, totalApplications, totalCandidates, activeJobs, positionsAppliedFor] = await Promise.all([
      Job.countDocuments(),
      Application.countDocuments(),
      User.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments()
    ]);

    const recentApplications = await Application.find()
      .populate('job', 'title')
      .populate('user', 'fullname email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalJobs,
        totalApplications,
        totalCandidates,
        activeJobs,
        positionsAppliedFor
      },
      recentApplications,
      recentJobs
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/dashboard/charts
export const getChartData = async (req: Request, res: Response) => {
  try {
    // Applications by month
    const applicationsByMonth = await Application.aggregate([
      {
        $group: {
          _id: { 
            month: { $month: "$createdAt" }, 
            year: { $year: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      applicationsByMonth,
      applicationsByStatus
    });
  } catch (error) {
    console.error("Chart data error:", error);
    res.status(500).json({ error: "Server error" });
  }
};