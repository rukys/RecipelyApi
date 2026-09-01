import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Article Endpoints', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('GET /api/category/article', () => {
    it('should return list of article categories', async () => {
      const res = await request(app).get('/api/category/article');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('method', 'GET');
      expect(res.body).toHaveProperty('status', true);
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.results.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/category/article/:category', () => {
    it('should return articles for a given category', async () => {
      const res = await request(app).get('/api/category/article/inspirasi-dapur?limit=3');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.results)).toBe(true);
    }, 20000);
  });

  describe('GET /api/articles/new', () => {
    it('should return latest articles', async () => {
      const res = await request(app).get('/api/articles/new?limit=3');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(Array.isArray(res.body.results)).toBe(true);
    }, 20000);
  });

  describe('GET /api/article/:category/:slug', () => {
    it('should return article detail', async () => {
      const res = await request(app).get('/api/article/inspirasi-dapur/ide-masak-hari-ini');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(true);
      expect(res.body.results).toHaveProperty('title');
      expect(res.body.results).toHaveProperty('thumb');
      expect(res.body.results).toHaveProperty('author');
      expect(res.body.results).toHaveProperty('description');
    }, 20000);
  });

  describe('GET /api/nonexistent-route', () => {
    it('should return 404 with standard error envelope', async () => {
      const res = await request(app).get('/api/nonexistent-route');
      expect(res.status).toBe(404);
      expect(res.body.status).toBe(false);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code', 'ROUTE_NOT_FOUND');
    });
  });
});
