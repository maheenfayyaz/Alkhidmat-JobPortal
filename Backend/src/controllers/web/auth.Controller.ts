import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/tokenUtils";
import { User } from "../../models/web/User"
import { signupSchema } from "../../validation/authValidation";
import { IUser } from "../../models/web/User";


export const signup = async (req: Request, res: Response) => {
  try {
    const { fullname, email, password } = req.body; // confirmPassword is ignored here

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Save only password (not confirmPassword)
    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const refreshAccessToken = (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No refresh token provided" });

    const decoded = verifyRefreshToken(token) as { id: string; email: string };
    const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Compare passwords
    if (!user.password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
};

export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    if (!user) {
      return res.redirect('http://localhost:8080/login?error=auth_failed');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Redirect to frontend with token (use account-success for new users, but since unified, use account-success and let frontend handle)
    const frontendUrl = `http://localhost:8080/account-success?token=${token}&userId=${user._id}`;
    res.redirect(frontendUrl);
  } catch (error: any) {
    console.error("Google callback error:", error);
    res.redirect('http://localhost:8080/login?error=server_error');
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // User is attached by auth middleware
    const user = req.user as IUser;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error: any) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
