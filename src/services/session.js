import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRE = 15 * 60;
const REFRESH_TOKEN_EXPIRE = 30 * 24 * 60 * 60;

function getAccessTokenSecret() {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not set in environment variables');
  }
  return secret;
}

function getRefreshTokenSecret() {
  return process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';
}

export function generateTokens(userId) {
  const accessTokenExp = new Date(Date.now() + ACCESS_TOKEN_EXPIRE * 1000);
  const refreshTokenExp = new Date(Date.now() + REFRESH_TOKEN_EXPIRE * 1000);

  const accessToken = jwt.sign({ userId }, getAccessTokenSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

  const refreshToken = jwt.sign({ userId }, getRefreshTokenSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

  return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
}

export async function saveSession({
  userId,
  accessToken,
  refreshToken,
  accessTokenValidUntil,
  refreshTokenValidUntil,
}) {
  const session = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
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
