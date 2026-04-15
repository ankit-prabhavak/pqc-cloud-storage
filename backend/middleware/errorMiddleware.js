const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Duplicate key error (Mongo)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
    // show stack only in dev
    stack: process.env.NODE_ENV === "development" ? err.stack : null
  });
};

module.exports = errorHandler;