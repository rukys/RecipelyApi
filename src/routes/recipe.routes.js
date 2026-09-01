import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller.js';

const router = Router();

// GET /api/recipes-length/?limit=:limit
router.get('/recipes-length', RecipeController.getRecipesByLimit);

// GET /api/category/recipes
router.get('/category/recipes', RecipeController.getCategories);

// GET /api/category/recipes/:category
router.get('/category/recipes/:category', RecipeController.getRecipesByCategory);

// GET /api/recipe/:key
router.get('/recipe/:key(*)', RecipeController.getRecipeDetail);

// GET /api/recipes/:page (must come after specific routes)
router.get('/recipes/:page', RecipeController.getRecipes);

// GET /api/recipes
router.get('/recipes', RecipeController.getRecipes);

export default router;
