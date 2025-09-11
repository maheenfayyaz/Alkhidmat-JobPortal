import { Request, Response } from "express";
import { Admin } from "../../models/admin/Admin";

export const listAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await Admin.find({}, { email: 1, fullname: 1 });
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    res.status(500).json({ error: "Failed to fetch admin users" });
  }
};
