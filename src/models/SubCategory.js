import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, trim: true },
    description: { type: String, trim: true },
    taxApplicable: { type: Boolean }, // default from category if undefined
    tax: { type: Number, min: 0 }, // default from category if undefined
  },
  { timestamps: true }
);

SubCategorySchema.pre("validate", async function (next) {
  try {
    if (
      this.isNew ||
      this.isModified("category") ||
      this.taxApplicable === undefined ||
      this.tax === undefined
    ) {
      const Category = mongoose.model("Category");
      const parent = await Category.findById(this.category).lean();
      if (!parent) return next(new Error("Parent category not found"));
      if (this.taxApplicable === undefined)
        this.taxApplicable = parent.taxApplicable;
      if (this.tax === undefined) this.tax = parent.tax;
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
