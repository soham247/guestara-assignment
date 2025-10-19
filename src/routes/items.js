import express from 'express';
import {
  createItem,
  getAllItems,
  getItemByIdOrName,
  updateItem,
  getItemsByCategory,
  getItemsBySubCategory,
  searchItems,
} from '../controllers/itemController.js';

const router = express.Router();

// CRUD - Items
router.post('/', createItem); // expects body.categoryId or body.subCategoryId
router.get('/', getAllItems);
router.get('/search', searchItems);
router.get('/:idOrName', getItemByIdOrName);
router.patch('/:id', updateItem);

// Helpers for parent lookups
router.get('/by-category/:categoryId', getItemsByCategory);
router.get('/by-subcategory/:subCategoryId', getItemsBySubCategory);

export default router;
