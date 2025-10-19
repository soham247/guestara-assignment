import asyncHandler from "../utils/wrapAsync.js";
import { Item } from "../models/Item.js";
import { Category } from "../models/Category.js";
import { SubCategory } from "../models/SubCategory.js";
import { isObjectId } from "../utils/mongo.js";

export const createItem = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId || req.body.categoryId;
  const subCategoryId = req.params.subCategoryId || req.body.subCategoryId;
  const { name, image, description, taxApplicable, tax, baseAmount, discount } = req.body;

  if (!categoryId && !subCategoryId) {
    return res
      .status(400)
      .json({ message: "Provide either categoryId or subCategoryId" });
  }
  if (categoryId && subCategoryId) {
    return res
      .status(400)
      .json({ message: "Provide only one of categoryId or subCategoryId" });
  }

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category)
      return res.status(404).json({ message: "Parent category not found" });
  }
  if (subCategoryId) {
    const sub = await SubCategory.findById(subCategoryId);
    if (!sub)
      return res.status(404).json({ message: "Parent sub-category not found" });
  }

  const item = await Item.create({
    category: categoryId || undefined,
    subCategory: subCategoryId || undefined,
    name,
    image,
    description,
    taxApplicable,
    tax,
    baseAmount,
    discount,
  });

  if(!item) {
    return res.status(500).json({ message: "Failed to create item" });
  }

  res.status(201).json(item);
});

export const getAllItems = asyncHandler(async (_req, res) => {
  const items = await Item.find()
    .populate("category", "name")
    .populate("subCategory", "name")
    .sort({ createdAt: -1 });

  if (!items)
    return res.status(500).json({ message: "Error fetching items" });

  res.json(items);
});

export const getItemsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if(!categoryId) {
    return res.status(400).json({ message: "categoryId is required" });
  }

  const items = await Item.find({ category: categoryId }).sort({
    createdAt: -1,
  });

  if (!items)
    return res.status(500).json({ message: "Error fetching items" });

  res.json(items);
});

export const getItemsBySubCategory = asyncHandler(async (req, res) => {
  const { subCategoryId } = req.params;

  if(!subCategoryId) {
    return res.status(400).json({ message: "subCategoryId is required" });
  }

  const items = await Item.find({ subCategory: subCategoryId }).sort({
    createdAt: -1,
  });
  res.json(items);
});

export const getItemByIdOrName = asyncHandler(async (req, res) => {
  const { idOrName } = req.params;
  const query = isObjectId(idOrName) ? { _id: idOrName } : { name: idOrName };

  const item = await Item.findOne(query)
    .populate("category", "name")
    .populate("subCategory", "name");
  
  if (!item) return res.status(404).json({ message: "Item not found" });

  res.json(item);
});

export const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "id is required" });

  const allowed = [
    "name",
    "image",
    "description",
    "taxApplicable",
    "tax",
    "baseAmount",
    "discount",
    "category",
    "subCategory",
  ];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

  const item = await Item.findById(id);
  if (!item) return res.status(404).json({ message: "Item not found" });

  // guard against both parents
  if (
    "category" in updates &&
    "subCategory" in updates &&
    updates.category &&
    updates.subCategory
  ) {
    return res
      .status(400)
      .json({ message: "Provide only one of category or subCategory" });
  }

  Object.assign(item, updates);
  await item.save(); // triggers pre-validate to recompute totals and defaults
  res.json(item);
});

export const searchItems = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name || String(name).trim() === "")
    return res.status(400).json({ message: "name query is required" });

  const items = await Item.find({
    name: { $regex: String(name), $options: "i" },
  }).limit(50);
  
  res.json(items);
});
