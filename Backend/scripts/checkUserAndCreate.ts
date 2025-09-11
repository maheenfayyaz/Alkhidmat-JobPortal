import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/web/User";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

const userIdToCheck = "68bce97bdb2fa0821c98c355";

async function checkUserAndCreate() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const user = await User.findById(userIdToCheck);
    if (user) {
      console.log(`User with ID ${userIdToCheck} already exists.`);
    } else {
      console.log(`User with ID ${userIdToCheck} not found. Creating new user...`);
      const newUser = new User({
        _id: userIdToCheck,
        fullname: "Default User",
        email: "defaultuser@example.com",
        password: "defaultpassword123", // You should hash this in real app
      });
      await newUser.save();
      console.log("New user created successfully.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

checkUserAndCreate();
