import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';
import { errorResponse } from '../utils/response.util.js';

export const rateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      {
        code: 'TOO_MANY_REQUESTS',
        message: `Terlalu banyak permintaan. Batas maksimum ${config.rateLimitMax} request per menit.`,
        details: null
      },
      429
    );
  }
});
