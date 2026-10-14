function notFound(req, res) {
  res.status(404).json({ message: 'Endpoint not found.' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line no-unused-vars
  if (res.headersSent) return next(error);
  if (error.name === 'MulterError') {
    const message = error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 8 MB or smaller.' : error.message;
    return res.status(400).json({ message });
  }
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((item) => item.message).join(' ');
    return res.status(400).json({ message });
  }
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid resource ID.' });
  const status = error.status || error.statusCode || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({ message: status >= 500 ? 'An unexpected server error occurred.' : error.message });
}

module.exports = { notFound, errorHandler };
