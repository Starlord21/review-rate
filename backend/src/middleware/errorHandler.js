function notFound(req, res, next) {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const details = error.name === "ValidationError"
    ? Object.values(error.errors).map((item) => item.message)
    : undefined;

  res.status(statusCode).json({
    message: error.message || "Server error",
    details
  });
}

module.exports = { notFound, errorHandler };
