export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details = null) {
    super(message, 404, code, details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request parameters', code = 'BAD_REQUEST', details = null) {
    super(message, 400, code, details);
  }
}

export class UpstreamError extends AppError {
  constructor(message = 'Failed to fetch data from upstream provider', code = 'UPSTREAM_ERROR', details = null) {
    super(message, 502, code, details);
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Upstream request timed out', code = 'UPSTREAM_TIMEOUT', details = null) {
    super(message, 504, code, details);
  }
}
