import asyncHandler from "../utils/wrapAsync.js";
import { Category } from "../models/Category.js";
import { SubCategory } from "../models/SubCategory.js";
import { isObjectId } from "../utils/mongo.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, image, description, taxApplicable, tax, taxType } = req.body;

  const existing = await Category.findOne({ name });
  if (existing)
    return res.status(400).json({ message: "Category already exists" });

  const category = await Category.create({
    name,
    image,
    description,
    taxApplicable,
    tax,
    taxType,
  });

  if (!category)
    return res.status(500).json({ message: "Error creating category" });

  res.status(201).json(category);
});

export const getAllCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  if (!categories)
    return res.status(500).json({ message: "Error fetching categories" });
  
  res.json(categories);
});

export const getCategoryByIdOrName = asyncHandler(async (req, res) => {
  const { idOrName } = req.params;
  const query = isObjectId(idOrName) ? { _id: idOrName } : { name: idOrName };
  const category = await Category.findOne(query);
  if (!category) return res.status(404).json({ message: "Category not found" });

  // also fetch its subcategories and items counts
  const [subCount] = await Promise.all([
    SubCategory.countDocuments({ category: category._id }),
  ]);

  res.json({ ...category.toObject(), subCategoryCount: subCount });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // only allow these fields
  const allowed = [
    "name",
    "image",
    "description",
    "taxApplicable",
    "tax",
    "taxType",
  ];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

  const category = await Category.findById(id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  Object.assign(category, updates);
  await category.save();
  res.json(category);
});
