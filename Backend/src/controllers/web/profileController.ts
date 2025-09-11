import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/web/User";
import { Document } from "mongoose";

// Helper function to get user from token
const getUserFromToken = async (req: Request): Promise<Document<unknown, {}, any> & any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.substring(7);
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; email: string };

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromToken(req);
    console.log("User profile data:", user);

    // Cast user to any to access dynamic properties
    const u = user as any;

    res.status(200).json({
      message: "Profile retrieved successfully",
      profile: {
        id: u._id,
        fullname: u.fullname,
        email: u.email,
        title: u.title || "",
        about: u.about || "",
        age: u.age || "",
        nationalId: u.nationalId || "",
        phone: u.phone || "",
        address: u.address || "",
        city: u.city || "",
        country: u.country || "",
        dateOfBirth: u.dateOfBirth || "",
        experience: u.experience || [],
        education: u.education || [],
        profileImage: u.profileImage || "",
      },
    });
  } catch (error: any) {
    console.error("Get profile error:", error);
    if (error.message === 'No token provided' || error.message === 'User not found') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile
import fs from "fs";
import path from "path";

import bcrypt from "bcrypt";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserFromToken(req);
    const u = user as any;

    // For multipart/form-data, req.body may be empty or not parsed as JSON
    // Use multer or parse fields manually if needed
    let fullname, title, about, age, nationalId, phone, city, address, country, dateOfBirth, experience, education, profileImage, newPassword;

    if (req.is('multipart/form-data')) {
      // Fields come as strings, parse JSON fields
      const body = req.body || {};
      fullname = body.fullname;
      title = body.title;
      about = body.about;
      age = body.age;
      nationalId = body.nationalId;
      phone = body.phone;
      city = body.city;
      address = body.address;
      country = body.country;
      dateOfBirth = body.dateOfBirth;
      newPassword = body.newPassword;

      try {
        experience = body.experience ? JSON.parse(body.experience) : [];
      } catch {
        experience = [];
      }
      try {
        education = body.education ? JSON.parse(body.education) : [];
      } catch {
        education = [];
      }

      // profileImage file is in req.file or req.files depending on multer config
      if (req.file && req.file.filename) {
        profileImage = `/uploads/profile_images/${req.file.filename}`;
      } else if (req.files && typeof req.files === 'object' && 'profileImage' in req.files) {
        const filesArray = Array.isArray(req.files.profileImage) ? req.files.profileImage : [req.files.profileImage];
        if (filesArray.length > 0 && filesArray[0].filename) {
          profileImage = `/uploads/profile_images/${filesArray[0].filename}`;
        } else {
          profileImage = u.profileImage || "";
        }
      } else if (body.profileImage) {
        profileImage = body.profileImage;
      } else {
        profileImage = u.profileImage || "";
      }
    } else {
      // JSON body
      ({
        fullname,
        title,
        about,
        age,
        nationalId,
        phone,
        city,
        address,
        country,
        dateOfBirth,
        experience,
        education,
        profileImage,
        newPassword,
      } = req.body);
    }

    console.log("Received profileImage length:", profileImage ? profileImage.length : 0);
    // Handle profileImage if it's a base64 string
    if (profileImage && profileImage.startsWith("data:image")) {
      console.log("Processing base64 profile image");
      // Extract base64 data
      const matches = profileImage.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        console.error("Invalid image data format");
        return res.status(400).json({ error: "Invalid image data" });
      }
      const ext = matches[1];
      const data = matches[2];
      const buffer = Buffer.from(data, "base64");

      // Generate unique filename
      const filename = `profile_${u._id}_${Date.now()}.${ext}`;
      const uploadPath = path.join(__dirname, "../../../uploads/profile_images");

      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        try {
          fs.mkdirSync(uploadPath, { recursive: true });
          console.log("Created upload directory:", uploadPath);
        } catch (err) {
          console.error("Error creating upload directory:", err);
          return res.status(500).json({ error: "Failed to create upload directory" });
        }
      }

      const filePath = path.join(uploadPath, filename);
      console.log("Saving profile image to:", filePath);

      // Save file
      try {
        fs.writeFileSync(filePath, buffer);
        console.log("Profile image saved successfully");
      } catch (err) {
        console.error("Error saving profile image file:", err);
        return res.status(500).json({ error: "Failed to save profile image" });
      }

      // Save relative path or URL to user profileImage field
      u.profileImage = `/uploads/profile_images/${filename}`;
      console.log("Updated user profileImage path:", u.profileImage);
    } else if (profileImage !== undefined) {
      // If profileImage is a URL or empty string
      u.profileImage = profileImage;
      console.log("Profile image set to URL or empty string:", profileImage);
    }

    // Update other user fields
    if (fullname !== undefined) u.fullname = fullname;
    if (title !== undefined) u.title = title;
    if (about !== undefined) u.about = about;
    if (age !== undefined) u.age = age;
    if (nationalId !== undefined) u.nationalId = nationalId;
    if (phone !== undefined) u.phone = phone;
    if (city !== undefined) u.city = city;
    if (address !== undefined) u.address = address;
    if (country !== undefined) u.country = country;
    if (dateOfBirth !== undefined) u.dateOfBirth = dateOfBirth;
    if (experience !== undefined) u.experience = experience;
    if (education !== undefined) u.education = education;

    // Hash and update password if newPassword is provided
    if (newPassword) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      u.password = hashedPassword;
    }

    await u.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        id: u._id,
        fullname: u.fullname,
        email: u.email,
        title: u.title || "",
        about: u.about || "",
        age: u.age || "",
        nationalId: u.nationalId || "",
        phone: u.phone || "",
        address: u.address || "",
        city: u.city || "",
        country: u.country || "",
        dateOfBirth: u.dateOfBirth || "",
        experience: u.experience || [],
        education: u.education || [],
        profileImage: u.profileImage || "",
      },
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    if (error.message === 'No token provided' || error.message === 'User not found') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error" });
  }
};
