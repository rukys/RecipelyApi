import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { rateLimiter } from './middlewares/rate-limiter.js';
import { swaggerUiOptions } from './docs/swagger-ui.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerDocument = JSON.parse(
  readFileSync(join(__dirname, 'docs', 'swagger.json'), 'utf8')
);

export const createApp = () => {
  const app = express();

  // Security & standard middlewares
  app.use(helmet({
    contentSecurityPolicy: false // Allows Swagger UI assets
  }));
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  // Rate Limiting
  app.use('/api/', rateLimiter);

  // Swagger Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerUiOptions));

  // Root redirect/landing
  app.get('/', (req, res) => {
    res.json({
      name: 'Recipely API',
      description: 'MasakApaHariIni Scraper Backend for RecipelyApp',
      version: '1.0.0',
      docs: '/api/docs',
      endpoints: {
        recipes: '/api/recipes',
        recipesByPage: '/api/recipes/1',
        recipesByLimit: '/api/recipes-length/?limit=5',
        recipeCategories: '/api/category/recipes',
        recipesByCategory: '/api/category/recipes/sarapan',
        recipeDetail: '/api/recipe/:key',
        recipeSearch: '/api/search/?q=ayam',
        articleCategories: '/api/category/article',
        articlesByCategory: '/api/category/article/inspirasi-dapur',
        newArticles: '/api/articles/new',
        articleDetail: '/api/article/:key'
      }
    });
  });

  // Mount API routes
  app.use(config.apiPrefix, apiRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
