import logger from '../config/logger.js';

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const code = err.code ||
    (status === 400 ? 'VALIDATION_ERROR' :
    status === 401 ? 'AUTH_ERROR' :
    status === 403 ? 'FORBIDDEN' :
    status === 404 ? 'NOT_FOUND' : 'INTERNAL');
  const message = err.message || 'Internal server error';
  const details = err.details || [];

  if (status >= 500) {
    logger.error(message, err.stack);
  }

  res.status(status).json({
    error: { code, message, details },
  });
}
