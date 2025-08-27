export function ok(res, data, status = 200) {
  res.status(status).json(data);
}

export function created(res, data) {
  ok(res, data, 201);
}

export function noContent(res) {
  res.status(204).send();
}

export function httpError(status, code, message, details) {
  const err = new Error(message);
  err.status = status;
  err.code = code;
  if (details) err.details = details;
  return err;
}
