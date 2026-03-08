const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/featured', recipeController.getFeaturedRecipes);
router.get('/categories', recipeController.getCategories);
router.get('/search', recipeController.searchRecipes);
router.get('/:id', recipeController.getRecipeById);

module.exports = router;
