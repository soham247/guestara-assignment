import asyncHandler from "../utils/wrapAsync.js";
import { SubCategory } from "../models/SubCategory.js";
import { Category } from "../models/Category.js";
import { isObjectId } from "../utils/mongo.js";

export const createSubCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId || req.body.categoryId;
  const { name, image, description, taxApplicable, tax } = req.body;

  if (!categoryId)
    return res.status(400).json({ message: "categoryId is required" });

  const category = await Category.findById(categoryId);
  if (!category)
    return res.status(404).json({ message: "Parent category not found" });

  const sub = await SubCategory.create({
    category: categoryId,
    name,
    image,
    description,
    taxApplicable,
    tax,
  });

  if (!sub)
    return res.status(500).json({ message: "Error creating sub-category" });

  res.status(201).json(sub);
});

export const getAllSubCategories = asyncHandler(async (_req, res) => {
  const subs = await SubCategory.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });

  if (!subs)
    return res.status(500).json({ message: "Error fetching sub-categories" });

  res.json(subs);
});

export const getSubCategoriesByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if(!categoryId) {
    return res.status(400).json({ message: "categoryId is required" });
  }

  const subs = await SubCategory.find({ category: categoryId }).sort({
    createdAt: -1,
  });

  if (!subs)
    return res.status(500).json({ message: "Error fetching sub-categories" });

  res.json(subs);
});

export const getSubCategoryByIdOrName = asyncHandler(async (req, res) => {
  const { idOrName } = req.params;

  const query = isObjectId(idOrName)
    ? { _id: idOrName }
    : { name: { $regex: new RegExp(`^${idOrName}$`, "i") } };
  const sub = await SubCategory.findOne(query).populate("category", "name");

  if (!sub) return res.status(404).json({ message: "Sub-category not found" });

  res.json(sub);
});

export const updateSubCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "subCategoryId is required" });
  
  const allowed = [
    "name",
    "image",
    "description",
    "taxApplicable",
    "tax",
    "category",
  ];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

  const sub = await SubCategory.findById(id);
  if (!sub) return res.status(404).json({ message: "Sub-category not found" });

  Object.assign(sub, updates);
  await sub.save();
  res.json(sub);
});
