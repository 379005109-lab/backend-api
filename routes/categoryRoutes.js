const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  getCategoryTree,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Tree endpoint must come before /:id
router.get('/tree', getCategoryTree);

router.route('/')
  .get(getAllCategories)
  .post(createCategory);

router.route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
