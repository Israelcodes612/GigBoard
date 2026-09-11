import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
} = process.env;

// --- Access token (short-lived, sent in JSON response) ---
export function generateAccessToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

// --- Refresh token (long-lived, sent as httpOnly cookie) ---
export function generateRefreshToken(user) {
  return jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

// --- Hash the refresh token before storing it in the DB ---
// We never store the raw refresh token, only this hash — same idea as passwords,
// but SHA-256 is enough here since it's not a human-guessable secret like a password.
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}