import { Router } from 'express';
import recipeRoutes from './recipe.routes.js';
import articleRoutes from './article.routes.js';
import { SearchController } from '../controllers/search.controller.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// GET /api/search/?q=:keyword
router.get('/search', SearchController.searchRecipes);

// Mount Recipe & Article routes
router.use('/', recipeRoutes);
router.use('/', articleRoutes);

export default router;
