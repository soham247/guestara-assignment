import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, trim: true },
    description: { type: String, trim: true },
    taxApplicable: { type: Boolean, required: true, default: false },
    tax: { type: Number, default: 0, min: 0 },
    taxType: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
