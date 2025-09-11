import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/web/User";

interface JwtPayload {
  id: string;
  email: string;
}

// Extend the Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const userAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    console.log("Authorization header:", authHeader);
    const token = authHeader?.replace("Bearer ", "");
    console.log("Extracted token:", token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    console.log("Decoded JWT payload:", decoded);
    const user = await User.findById(decoded.id).select("-password");
    console.log("User found:", user);

    if (!user) {
      console.log("User not found for token");
      return res.status(401).json({ error: "Invalid token. User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("User auth middleware error:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};
