import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId; // admin user
  createdAt: Date;
  company?: string;
  location?: string;
  department?: string;
  type?: string; 
  qualification?: string; 
  posted?: string;
  salary?: string;
  status?: string;
  requirements?: string;
  responsibilities?: string;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  salary: { type: String, required: false },
  location: { type: String, required: false },
  department: { type: String, required: false },
  qualification: { type: String, required: false },  // Added qualification field
  type: { type: String, required: false },  // Added type field
  status: { type: String, required: false },
  posted: { type: String, required: false },
  requirements: { type: String, required: false },
  responsibilities: { type: String, required: false },
});

export default mongoose.model<IJob>("Job", JobSchema);
