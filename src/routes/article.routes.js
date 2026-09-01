import { Router } from 'express';
import { ArticleController } from '../controllers/article.controller.js';

const router = Router();

// GET /api/category/article
router.get('/category/article', ArticleController.getCategories);

// GET /api/category/article/:category
router.get('/category/article/:category', ArticleController.getArticlesByCategory);

// GET /api/articles/new
router.get('/articles/new', ArticleController.getNewArticles);

// GET /api/article/:category/:slug or /api/article/:key
router.get('/article/:category/:slug', ArticleController.getArticleDetail);
router.get('/article/:key(*)', ArticleController.getArticleDetail);

export default router;
