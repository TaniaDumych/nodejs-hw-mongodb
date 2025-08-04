import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';

const JWT_TOKEN_EXPIRE = 15 * 60;
const REFRESH_TOKEN_EXPIRE = 30 * 24 * 60 * 60;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
}

function getRefreshTokenSecret() {
  return process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
}

export function generateTokens(userId) {
  const jwtTokenExp = new Date(Date.now() + JWT_TOKEN_EXPIRE * 1000);
  const refreshTokenExp = new Date(Date.now() + REFRESH_TOKEN_EXPIRE * 1000);

  const jwtToken = jwt.sign (
    { userId, iat: Math.floor(Date.now() / 1000) },
    getJwtSecret(),
    { expiresIn: JWT_TOKEN_EXPIRE }
  );

  const refreshToken = jwt.sign({ userId }, getRefreshTokenSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

  return { jwtToken, refreshToken, jwtTokenExp, refreshTokenExp };
}

export async function saveSession({
  userId,
  jwtToken,
  refreshToken,
  jwtTokenValidUntil,
  refreshTokenValidUntil,
}) {
  const session = new Session({
    userId,
    jwtToken,
    refreshToken,
    jwtTokenValidUntil,
    refreshTokenValidUntil,
  });

  return session.save();
}

export async function deleteSessionByUserId(userId) {
  return Session.deleteMany({ userId });
}

export async function findSessionByRefreshToken(refreshToken) {
  return Session.findOne({ refreshToken });
}

export async function deleteSessionById(sessionId) {
  return Session.findByIdAndDelete(sessionId);
}
