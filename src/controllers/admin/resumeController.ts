import { Request, Response } from "express";
import Application from "../../models/web/Application";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

// GET /api/admin/resumes/:id/download
export const downloadResume = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: "Invalid or missing application ID" });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID" });
    }

    const application = await Application.findById(id).populate('user', 'fullname');

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (!application.resumeLink) {
      return res.status(404).json({ error: "No resume found for this application" });
    }

    // If resumeLink is a URL, validate it before redirecting
    if (application.resumeLink.startsWith('http')) {
      const urlPattern = new RegExp('^(http|https)://');
      if (!urlPattern.test(application.resumeLink)) {
        return res.status(400).json({ error: "Invalid resume URL" });
      }
      return res.redirect(application.resumeLink);
    }

    // If it's a local file path
    const filePath = path.join(__dirname, '../../uploads/resumes', application.resumeLink);
    
    if (!fs.existsSync(filePath)) {
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
