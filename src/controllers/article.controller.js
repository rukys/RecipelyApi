import { ScraperService } from '../services/scraper.service.js';
import { successResponse } from '../utils/response.util.js';
import { BadRequestError } from '../utils/error.util.js';

export class ArticleController {
  /**
   * GET /api/category/article
   */
  static async getCategories(req, res, next) {
    try {
      const results = ScraperService.getArticleCategories();
      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/category/article/:category
   */
  static async getArticlesByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      if (!category) {
        throw new BadRequestError('Parameter category artikel wajib disertakan', 'ARTICLE_CATEGORY_REQUIRED');
      }

      const results = await ScraperService.getArticles({
        category,
        page,
        limit
      });

      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/articles/new
   */
  static async getNewArticles(req, res, next) {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      const results = await ScraperService.getArticles({
        page,
        limit
      });

      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/article/:category/:slug
   * GET /api/article/:key
   */
  static async getArticleDetail(req, res, next) {
    try {
      let key = req.params.key;
      if (req.params.category && req.params.slug) {
        key = `${req.params.category}/${req.params.slug}`;
      }

      if (!key) {
        throw new BadRequestError('Parameter article key wajib disertakan', 'ARTICLE_KEY_REQUIRED');
      }

      const results = await ScraperService.getArticleDetail(key);
      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }
}
