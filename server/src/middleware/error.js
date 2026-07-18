export function notFound(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map((e) => ({ path: e.path.join('.'), message: e.message })),
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with that value already exists' });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Avoid leaking internals in production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';
  res.status(500).json({ error: message });
}

export function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
