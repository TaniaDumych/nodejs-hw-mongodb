import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const { JWT_SECRET } = process.env;

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw createHttpError(401, 'Authorization header missing');
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw createHttpError(401, 'Invalid authorization format');
    }

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = { _id: payload.userId };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(createHttpError(401, 'Access token expired'));
    }
    return next(createHttpError(401, 'Invalid access token'));
  }
};

