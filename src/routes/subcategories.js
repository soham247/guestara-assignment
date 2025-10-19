import express from 'express';
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryByIdOrName,
  updateSubCategory,
} from '../controllers/subCategoryController.js';
import { getItemsBySubCategory, createItem } from '../controllers/itemController.js';

const router = express.Router();

// CRUD - SubCategories
router.post('/', createSubCategory); // expects body.categoryId
router.get('/', getAllSubCategories);
router.get('/:idOrName', getSubCategoryByIdOrName);
router.patch('/:id', updateSubCategory);

// Nested items
router.post('/:subCategoryId/items', createItem);
router.get('/:subCategoryId/items', getItemsBySubCategory);

export default router;
