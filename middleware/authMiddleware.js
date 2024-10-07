import { Unauthorized } from "./errorHandler.js";

export const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return next(new Unauthorized('Unauthorized: Missing x-user-id'));
  }

  req.userId = userId;
  next();
};
