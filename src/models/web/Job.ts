import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId; // admin user
  createdAt: Date;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IJob>("Job", JobSchema);
