import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {

  fullname: string;
  email: string;
  password: string;
  // Profile fields
  title?: string;
  about?: string;
  age?: string;
  nationalId?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  experience?: Array<{
    id: number;
    company: string;
    position: string;
    duration: string;
    logo?: string;
    bgColor?: string;
  }>;
  education?: Array<{
    id: number;
    institution: string;
    degree: string;
    duration: string;
    logo?: string;
    bgColor?: string;
  }>;
  profileImage?: string;
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
    // Profile fields
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    age: {
      type: String,
      trim: true,
    },
    nationalId: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      required: false,
      default: ""
    },
    country: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      trim: true,
    },
    experience: [{
      id: { type: Number, required: true },
      company: { type: String, required: true },
      position: { type: String, required: true },
      duration: { type: String, required: true },
      logo: { type: String },
      bgColor: { type: String },
    }],
    education: [{
      id: { type: Number, required: true },
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      duration: { type: String, required: true },
      logo: { type: String },
      bgColor: { type: String },
    }],
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
