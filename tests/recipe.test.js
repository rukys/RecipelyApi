import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Recipe Endpoints', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /api/recipes', () => {
    it('should return a list of recipes with 200 status', async () => {
      const res = await request(app).get('/api/recipes?limit=5');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('method', 'GET');
      expect(res.body).toHaveProperty('status', true);
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.results.length).toBeLessThanOrEqual(5);

      if (res.body.results.length > 0) {
        const item = res.body.results[0];
        expect(item).toHaveProperty('title');
        expect(item).toHaveProperty('thumb');
        expect(item).toHaveProperty('key');
        expect(item).toHaveProperty('times');
        expect(item).toHaveProperty('portion');
        expect(item).toHaveProperty('difficulty');
      }
    }, 20000);
  });

  describe('GET /api/recipes/:page', () => {
    it('should return recipes for page 2', async () => {
      const res = await request(app).get('/api/recipes/2?limit=3');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.results)).toBe(true);
    }, 20000);
  });

  describe('GET /api/recipes-length/?limit=:limit', () => {
    it('should return exact limited recipes', async () => {
      const res = await request(app).get('/api/recipes-length?limit=3');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.results.length).toBeLessThanOrEqual(3);
    }, 20000);
  });

  describe('GET /api/category/recipes', () => {
    it('should return recipe categories list', async () => {
      const res = await request(app).get('/api/category/recipes');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.results.length).toBeGreaterThan(0);
      expect(res.body.results[0]).toHaveProperty('category');
      expect(res.body.results[0]).toHaveProperty('key');
      expect(res.body.results[0]).toHaveProperty('url');
    });
  });

  describe('GET /api/category/recipes/:category', () => {
    it('should return recipes by category', async () => {
      const res = await request(app).get('/api/category/recipes/sarapan?limit=3');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.results)).toBe(true);
    }, 20000);
  });

  describe('GET /api/search/?q=:keyword', () => {
    it('should return search results', async () => {
      const res = await request(app).get('/api/search?q=ayam&limit=3');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.results)).toBe(true);
    }, 20000);

    it('should return 400 when search query is empty', async () => {
      const res = await request(app).get('/api/search?q=');
      expect(res.status).toBe(400);
      expect(res.body.status).toBe(false);
      expect(res.body.error).toHaveProperty('code', 'SEARCH_KEYWORD_REQUIRED');
    });
  });

  describe('GET /api/recipe/:key', () => {
    it('should return recipe detail with ingredients and steps', async () => {
      const res = await request(app).get('/api/recipe/cara-membuat-tumis-genjer-taoco-sederhana,-enak-dan-tidak-pahit--258644');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.results).toHaveProperty('title');
      expect(res.body.results).toHaveProperty('thumb');
      expect(res.body.results).toHaveProperty('servings');
      expect(res.body.results).toHaveProperty('times');
      expect(res.body.results).toHaveProperty('desc');
      expect(Array.isArray(res.body.results.ingredient)).toBe(true);
      expect(Array.isArray(res.body.results.step)).toBe(true);
    }, 20000);
  });
});
