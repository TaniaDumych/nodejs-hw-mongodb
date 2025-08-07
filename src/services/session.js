import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';


const  ACCESS_TOKEN_EXPIRE= 15 * 60;
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
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_EXPIRE * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_EXPIRE * 1000);

  const accessToken = jwt.sign (
    { userId, iat: Math.floor(Date.now() / 1000) },
    getJwtSecret(),
    { expiresIn:ACCESS_TOKEN_EXPIRE }
  );

  const refreshToken = jwt.sign({ userId }, getRefreshTokenSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

  return { accessToken, refreshToken, accessTokenValidUntil,refreshTokenValidUntil, };
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
