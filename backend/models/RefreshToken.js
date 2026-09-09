import pool from '../config/db.js';

export async function storeRefreshToken({ userId, tokenHash, expiresAt }) {
  const result = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [userId, tokenHash, expiresAt]
  );
  return result.rows[0];
}

export async function findValidRefreshToken(tokenHash) {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = $1 AND revoked = FALSE AND expires_at > NOW()`,
    [tokenHash]
  );
  return result.rows[0] || null;
}

export async function revokeRefreshToken(tokenHash) {
  await pool.query(
    `UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1`,
    [tokenHash]
  );
}

export async function revokeAllUserTokens(userId) {
  await pool.query(
    `UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1`,
    [userId]
  );
}