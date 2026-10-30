const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  // add request information to the error for logging
  error.requestInfo = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body,
  };

  console.error(error);
  res.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : "Internal server error",
  });
};;

export default errorHandler;
