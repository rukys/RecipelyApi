import { AppError } from '../utils/error.util.js';
import { errorResponse } from '../utils/response.util.js';
import { config } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isProd = config.nodeEnv === 'production';

  // Log error details
  if (statusCode >= 500) {
    console.error(`[ERROR 500] ${req.method} ${req.originalUrl}:`, err.stack || err.message);
  } else {
    console.warn(`[WARN ${statusCode}] ${req.method} ${req.originalUrl}: ${err.message}`);
  }

  const errorPayload = {
    code: err.code || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'Terjadi kesalahan pada server',
    details: (!isProd || err instanceof AppError) ? err.details : null
  };

  return errorResponse(res, errorPayload, statusCode);
};

export const notFoundHandler = (req, res, next) => {
  return errorResponse(
    res,
    {
      code: 'ROUTE_NOT_FOUND',
      message: `Endpoint '${req.method} ${req.originalUrl}' tidak ditemukan. Silakan cek dokumentasi di /api/docs`,
      details: null
    },
    404
  );
};
