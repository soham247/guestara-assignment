import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryByIdOrName,
  updateCategory,
} from "../controllers/categoryController.js";
import {
  createSubCategory,
  getSubCategoriesByCategory,
} from "../controllers/subCategoryController.js";
import {
  createItem,
  getItemsByCategory,
} from "../controllers/itemController.js";

const router = express.Router();

// CRUD - Categories
router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:idOrName", getCategoryByIdOrName);
router.patch("/:id", updateCategory);

// Nested resources (optional helpers)
router.post("/:categoryId/subcategories", createSubCategory);
router.get("/:categoryId/subcategories", getSubCategoriesByCategory);

router.post("/:categoryId/items", createItem);
router.get("/:categoryId/items", getItemsByCategory);

export default router;
