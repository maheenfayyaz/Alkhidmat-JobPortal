import { Request, Response } from "express";
import Application from "../../models/web/Application";
import { User } from "../../models/web/User";
import Job from "../../models/web/Job";

const escapeCSVValue = (value: any) => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  if (stringValue.includes(',') || stringValue.includes('\n')) {
    return `"${stringValue}"`;
  }
  return stringValue;
};

// Helper function to convert to CSV
const convertToCSV = (data: any[], headers: string[]) => {
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      return escapeCSVValue(value);
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// GET /api/admin/export/candidates
export const exportCandidates = async (req: Request, res: Response) => {
  try {
    interface ICandidate {
      fullname: string;
      email: string;
      phone?: string;
      createdAt: Date;
    }

    const candidates = await User.find({})
      .select('fullname email phone createdAt')
      .lean();

    const candidatesWithStats = await Promise.all(
      candidates.map(async (candidate) => {
        const applicationCount = await Application.countDocuments({ user: candidate._id });
const c = candidate as unknown as ICandidate;
        return {
          fullname: c.fullname,
          email: c.email,
          phone: c.phone || 'N/A',
          applicationCount,
          joinedDate: new Date(c.createdAt).toLocaleDateString()
        };
      })
    );

    const headers = ['fullname', 'email', 'phone', 'applicationCount', 'joinedDate'];
    const csv = convertToCSV(candidatesWithStats, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="candidates.csv"');
    res.send(csv);
  } catch (error) {
    console.error("Export candidates error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/export/applications
export const exportApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({})
      .populate('user', 'fullname email phone')
      .populate('job', 'title company')
      .lean();

    const formattedApplications = applications.map(app => {
      const user = app.user as { fullname?: string; email?: string; phone?: string } | undefined;
      const job = app.job as { title?: string; company?: string } | undefined;
      return {
        candidateName: user?.fullname || 'N/A',
        candidateEmail: user?.email || 'N/A',
        candidatePhone: user?.phone || 'N/A',
        jobTitle: job?.title || 'N/A',
        company: job?.company || 'N/A',
        status: app.status,
        experience: app.experience || 'N/A',
        skills: Array.isArray(app.skills) ? app.skills.join('; ') : 'N/A',
        appliedDate: new Date(app.createdAt).toLocaleDateString()
      };
    });

    const headers = [
      'candidateName', 'candidateEmail', 'candidatePhone', 
      'jobTitle', 'company', 'status', 'experience', 'skills', 'appliedDate'
    ];
    const csv = convertToCSV(formattedApplications, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applications.csv"');
    res.send(csv);
  } catch (error) {
    console.error("Export applications error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/export/jobs
export const exportJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find({})
      .lean();

    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job: job._id });
        const j = job as { company?: string; location?: string; status?: string; createdBy?: { fullname?: string } };
        return {
          title: job.title,
          description: job.description,
          company: j.company || 'N/A',
          location: j.location || 'N/A',
          status: j.status || 'active',
          applicationCount,
          createdBy: j.createdBy?.fullname || 'N/A',
          createdDate: new Date(job.createdAt).toLocaleDateString()
        };
      })
    );

    const headers = [
      'title', 'description', 'company', 'location', 
      'status', 'applicationCount', 'createdBy', 'createdDate'
    ];
    const csv = convertToCSV(jobsWithStats, headers);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="jobs.csv"');
    res.send(csv);
  } catch (error) {
    console.error("Export jobs error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
