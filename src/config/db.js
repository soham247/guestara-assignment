import mongoose from "mongoose";

// Connect to MongoDB
export const connectDB = async (uri) => {
  if (!uri) throw new Error("MONGODB_URI is required");
  try {
    await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
