export const authMiddleware = (req, res, next) => {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: Missing x-user-id' });
  }

  req.userId = userId;
  next();
};
