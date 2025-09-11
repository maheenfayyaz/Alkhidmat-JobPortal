import { Request, Response } from "express";
import Application from "../../models/web/Application";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import archiver from "archiver";

// GET /api/admin/resumes/:id/download
export const downloadResume = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id;
    console.log("Download resume requested for application ID:", applicationId);
    if (!applicationId || typeof applicationId !== 'string') {
      console.error("Invalid or missing application ID:", applicationId);
      return res.status(400).json({ error: "Invalid or missing application ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      console.error("Invalid application ID format:", applicationId);
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const application = await Application.findById(applicationId).populate('user', 'fullname');
    console.log("Found application:", application);

    if (!application) {
      console.error("Application not found for ID:", applicationId);
      return res.status(404).json({ error: "Application not found" });
    }

    if (!application.resumeLink) {
      console.error("No resumeLink found for application ID:", applicationId);
      return res.status(404).json({ error: "No resume found for this application" });
    }

    // Normalize resumeLink path for Windows-style paths stored in DB
    let resumePath = application.resumeLink;
    if (resumePath.startsWith('C:\\') || resumePath.startsWith('C:/')) {
      // Extract filename from full Windows path
      resumePath = path.basename(resumePath);
    }

    // If resumeLink is a URL, validate it before redirecting
    if (resumePath.startsWith('http')) {
      const urlPattern = new RegExp('^(http|https)://');
      if (!urlPattern.test(resumePath)) {
        return res.status(400).json({ error: "Invalid resume URL" });
      }
      return res.redirect(resumePath);
    }

    // If it's a local file path
    const resumeFileName = resumePath;
    const projectRoot = path.resolve(__dirname, '../../../');
    const filePath = path.join(projectRoot, 'uploads/resumes', resumeFileName);
    console.log("Resolved resume file path:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("Resume file not found at path:", filePath);
      return res.status(404).json({ error: "Resume file not found" });
    }

    const candidateName = (application.user as { fullname?: string })?.fullname || 'candidate';
    const fileName = `${candidateName}_resume.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Download resume error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/resumes/:id/view
export const viewResume = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; // Explicit type assertion

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const application = await Application.findById(id).populate('user');

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (!application.resumeLink) {
      return res.status(404).json({ error: "No resume found for this application" });
    }

    res.json({ 
      resumeUrl: application.resumeLink,
      portfolioUrl: application.portfolioLink || null
    });
  } catch (error) {
    console.error("View resume error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/admin/resumes/downloadAll
export const downloadAllResumes = async (req: Request, res: Response) => {
  try {
    const projectRoot = path.resolve(__dirname, '../../../');
    const resumesDir = path.join(projectRoot, 'uploads/resumes');

    // Fetch all applications with resumeLink
    const applications = await Application.find({ resumeLink: { $exists: true, $ne: null } }).populate('user', 'fullname');

    if (!applications.length) {
      return res.status(404).json({ error: "No resumes found to download" });
    }

    res.setHeader('Content-Disposition', 'attachment; filename="all_resumes.zip"');
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', function(err) {
      console.error('Archive error:', err);
      res.status(500).send({ error: 'Error creating archive' });
    });

    archive.pipe(res);

    for (const app of applications) {
      if (!app.resumeLink) continue;

      let resumePath = '';
      if (app.resumeLink.startsWith('http')) {
        // Skip URLs for now or handle differently if needed
        continue;
      } else {
        const resumeFileName = path.basename(app.resumeLink);
        resumePath = path.join(resumesDir, resumeFileName);
      }

      if (fs.existsSync(resumePath)) {
        const candidateName = (app.user as { fullname?: string })?.fullname || 'candidate';
        const fileName = `${candidateName}_resume${path.extname(resumePath)}`;
        archive.file(resumePath, { name: fileName });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("Download all resumes error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
