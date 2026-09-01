import { ScraperService } from '../services/scraper.service.js';
import { successResponse } from '../utils/response.util.js';
import { BadRequestError } from '../utils/error.util.js';

export class RecipeController {
  /**
   * GET /api/recipes
   * GET /api/recipes/:page
   */
  static async getRecipes(req, res, next) {
    try {
      const page = req.params.page || req.query.page || 1;
      const limit = req.query.limit || 10;
      const category = req.query.category || null;

      const pageNum = parseInt(page, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        throw new BadRequestError('Parameter page harus berupa angka bulat positif (>= 1)', 'INVALID_PAGE_PARAM');
      }

      const results = await ScraperService.getRecipes({
        page: pageNum,
        limit,
        category
      });

      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/recipes-length/?limit=:limit
   */
  static async getRecipesByLimit(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;

      const limitNum = parseInt(limit, 10);
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new BadRequestError('Parameter limit harus berupa angka antara 1 dan 100', 'INVALID_LIMIT_PARAM');
      }

      const results = await ScraperService.getRecipes({
        page,
        limit: limitNum
      });

      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/category/recipes
   */
  static async getCategories(req, res, next) {
    try {
      const results = ScraperService.getRecipeCategories();
      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/category/recipes/:category
   */
  static async getRecipesByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;

      if (!category) {
        throw new BadRequestError('Parameter category wajib disertakan', 'CATEGORY_REQUIRED');
      }

      const results = await ScraperService.getRecipes({
        page,
        limit,
        category
      });

      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/recipe/:key
   */
  static async getRecipeDetail(req, res, next) {
    try {
      const { key } = req.params;
      if (!key) {
        throw new BadRequestError('Parameter recipe key wajib disertakan', 'RECIPE_KEY_REQUIRED');
      }

      const results = await ScraperService.getRecipeDetail(key);
      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }
}
