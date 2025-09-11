import mongoose, { Schema, Document } from "mongoose";

export interface IApplication extends Document {
  job: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  experience: string;
  skills: string[];
  currentSalary?: number;
  expectedSalary?: number;
  noticePeriod?: string;
  coverLetter?: string;
  resumeLink?: string;
  portfolioLink?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
  adminNotes?: string;
  interviewDate?: string;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  
  // Personal Details
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String },
  
  // Professional Details
  experience: { type: String, required: true },
  skills: [{ type: String }], // Array of strings
  currentSalary: { type: Number },
  expectedSalary: { type: Number },
  noticePeriod: { type: String },
  
  // Application Details
  coverLetter: { type: String },
  resumeLink: { type: String },
  portfolioLink: { type: String },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },

  // Admin fields
  adminNotes: { type: String },
  interviewDate: { type: String },
  reviewedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IApplication>("Application", ApplicationSchema);
