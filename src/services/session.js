import Session from '../models/Session.js';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET; 
if (!ACCESS_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET is not set in environment variables');
}
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';


const ACCESS_TOKEN_EXPIRE = 15 * 60;          
const REFRESH_TOKEN_EXPIRE = 30 * 24 * 60 * 60; 


export function generateTokens(userId) {
  const accessTokenExp = new Date(Date.now() + ACCESS_TOKEN_EXPIRE * 1000);
  const refreshTokenExp = new Date(Date.now() + REFRESH_TOKEN_EXPIRE * 1000);

  const accessToken = jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
  const refreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });

  return { accessToken, refreshToken, accessTokenExp, refreshTokenExp };
}


export async function saveSession({ userId, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil }) {
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
