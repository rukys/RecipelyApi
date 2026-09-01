/**
 * Standarisasi Response Format RecipelyApp:
 * {
 *   method: "GET",
 *   status: true,
 *   results: [...]
 * }
 */
export const successResponse = (res, results, options = {}) => {
  const method = res.req?.method || 'GET';
  const statusCode = options.statusCode || 200;

  const payload = {
    method,
    status: true,
    results
  };

  return res.status(statusCode).json(payload);
};

/**
 * Detailed Error Response Format:
 * {
 *   method: "GET",
 *   status: false,
 *   statusCode: 404,
 *   error: {
 *     code: "RECIPE_NOT_FOUND",
 *     message: "...",
 *     details: "...",
 *     timestamp: "..."
 *   }
 * }
 */
export const errorResponse = (res, error, statusCode = 500) => {
  const method = res.req?.method || 'GET';
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = error.message || 'Internal Server Error';
  const details = error.details || null;

  return res.status(statusCode).json({
    method,
    status: false,
    statusCode,
    error: {
      code,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  });
};
