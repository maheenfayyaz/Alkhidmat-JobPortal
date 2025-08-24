import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
 
  fullname: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Email regex
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
