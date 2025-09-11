import { Request, Response } from "express";
import { Admin } from "../../models/admin/Admin";

// Get admin profile
export const getAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = req.user._id;
    const admin = await Admin.findById(adminId).select("-password");
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ profile: admin });
  } catch (error) {
    console.error("Get admin profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

import bcrypt from "bcrypt";

// Update admin profile
export const updateAdminProfile = async (req: Request, res: Response) => {
  try {
    const adminId = req.user._id;
    const { fullname, currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (fullname) {
      admin.fullname = fullname;
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      admin.password = hashedPassword;
    }

    // Save profile image if uploaded
    if (req.file) {
      // @ts-ignore
      admin.profileImage = req.file.filename;
    }

    await admin.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update admin profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
