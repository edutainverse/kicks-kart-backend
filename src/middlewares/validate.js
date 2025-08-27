export function validate(schema) {
  return (req, _res, next) => {
    const toValidate = {};
    if (schema.body) toValidate.body = req.body;
    if (schema.params) toValidate.params = req.params;
    if (schema.query) toValidate.query = req.query;

    const { error, value } = schema.root.validate(toValidate, { abortEarly: false, stripUnknown: true });
    if (error) {
      return next({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.details.map((d) => ({ path: d.path.join('.'), msg: d.message })),
      });
    }
    // assign sanitized values back
    if (schema.body) req.body = value.body || req.body;
    if (schema.params) req.params = value.params || req.params;
    if (schema.query) req.query = value.query || req.query;
    next();
  };
}
