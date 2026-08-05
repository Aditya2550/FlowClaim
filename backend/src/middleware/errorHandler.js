import { ApiError } from "../utils/apiError.js";

export const errorHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, details: err.details });
  }
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
};
