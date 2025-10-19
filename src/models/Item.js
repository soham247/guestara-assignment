import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },

    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, trim: true },
    description: { type: String, trim: true },

    taxApplicable: { type: Boolean }, // default from parent if undefined
    tax: { type: Number, min: 0 }, // default from parent if undefined

    baseAmount: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, min: 0 },
  },
  { timestamps: true }
);

ItemSchema.pre("validate", async function (next) {
  try {
    // ensure exactly one parent
    const hasCat = !!this.category;
    const hasSub = !!this.subCategory;
    if ((hasCat && hasSub) || (!hasCat && !hasSub)) {
      return next(
        new Error(
          "Item must reference either a category or a sub-category (but not both)."
        )
      );
    }

    // derive defaults from parent if needed
    if (this.taxApplicable === undefined || this.tax === undefined) {
      if (hasSub) {
        const SubCategory = mongoose.model("SubCategory");
        const sc = await SubCategory.findById(this.subCategory).lean();
        if (!sc) return next(new Error("Parent sub-category not found"));
        if (this.taxApplicable === undefined)
          this.taxApplicable = sc.taxApplicable;
        if (this.tax === undefined) this.tax = sc.tax;
      } else if (hasCat) {
        const Category = mongoose.model("Category");
        const c = await Category.findById(this.category).lean();
        if (!c) return next(new Error("Parent category not found"));
        if (this.taxApplicable === undefined)
          this.taxApplicable = c.taxApplicable;
        if (this.tax === undefined) this.tax = c.tax;
      }
    }

    // compute totalAmount
    const discount = this.discount ?? 0;
    this.totalAmount = Math.max(0, (this.baseAmount ?? 0) - discount);

    next();
  } catch (err) {
    next(err);
  }
});

export const Item = mongoose.model("Item", ItemSchema);
