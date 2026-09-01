import { ScraperService } from '../services/scraper.service.js';
import { successResponse } from '../utils/response.util.js';
import { BadRequestError } from '../utils/error.util.js';

export class SearchController {
  /**
   * GET /api/search/?q=:keyword
   */
  static async searchRecipes(req, res, next) {
    try {
      const keyword = req.query.q || req.query.keyword || '';
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;

      if (!keyword || !keyword.trim()) {
        throw new BadRequestError('Query pencarian (q) tidak boleh kosong', 'SEARCH_KEYWORD_REQUIRED');
      }

      const results = await ScraperService.getRecipes({
        search: keyword.trim(),
        page,
        limit
      });

      return successResponse(res, results);
    } catch (err) {
      next(err);
    }
  }
}
