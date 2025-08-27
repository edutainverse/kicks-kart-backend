export function roleGuard(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next({ status: 401, code: 'AUTH_ERROR', message: 'Unauthenticated' });
    if (!roles.includes(req.user.role)) {
      return next({ status: 403, code: 'FORBIDDEN', message: 'Insufficient role' });
    }
    next();
  };
}
