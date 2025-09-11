import { Request, Response } from "express";
import Application from "../../models/web/Application";

// GET /api/admin/applications/count
export const getTotalApplicationsCount = async (req: Request, res: Response) => {
  try {
    const totalApplications = await Application.countDocuments({});
    res.status(200).json({ totalApplications });
  } catch (error) {
    console.error("Get total applications count error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PATCH /api/admin/applications/:id/status
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const applicationId = req.params.id;
    const { status, notes, interviewDate } = req.body;

    if (!applicationId) {
      return res.status(400).json({ error: "Application ID is required" });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.adminNotes = notes;
    if (interviewDate !== undefined) updateData.interviewDate = interviewDate;

    const updatedApplication = await Application.findByIdAndUpdate(applicationId, updateData, { new: true });

    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application updated successfully", application: updatedApplication });
  } catch (error) {
    console.error("Update application status error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
