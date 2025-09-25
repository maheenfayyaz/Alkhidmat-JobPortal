import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import Application from "../../models/web/Application";
import archiver from "archiver";

export const proxyViewResume = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Find application by ID
    const application = await Application.findById(applicationId);
    if (!application || !application.resumeLink) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumePath = application.resumeLink;

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: "Resume file not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    const fileStream = fs.createReadStream(resumePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Proxy view resume error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const downloadAllResumes = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Fetch all applications with resume links
    const applications = await Application.find({ resumeLink: { $exists: true, $ne: "" } });

    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: "No resumes found" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=all_resumes.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(res);

    for (const app of applications) {
      const resumePath = app.resumeLink;
      if (resumePath && fs.existsSync(resumePath)) {
        archive.file(resumePath, { name: path.basename(resumePath) });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("Download all resumes error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const proxyDownloadResume = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Find application by ID
    const application = await Application.findById(applicationId);
    if (!application || !application.resumeLink) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumePath = application.resumeLink;

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: "Resume file not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${path.basename(resumePath)}"`);

    const fileStream = fs.createReadStream(resumePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Proxy download resume error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
