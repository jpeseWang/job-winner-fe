// lib/db.ts
import mongoose from "mongoose";
const connectDB = async (): Promise<void> => {
  if (mongoose.connections[0].readyState) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "job-winner", 
      bufferCommands: false,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
