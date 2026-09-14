import pool from '../config/db.js';

export async function cleanupExpiredTokens() {
  try {
    const result = await pool.query(
      `DELETE FROM refresh_tokens WHERE revoked = TRUE OR expires_at < NOW()`
    );
    if (result.rowCount > 0) {
      console.log(`Cleaned up ${result.rowCount} expired/revoked refresh tokens`);
    }
    return result.rowCount;
  } catch (err) {
    console.error('Token cleanup error:', err);
  }
}

export function startTokenCleanupJob(intervalMs = 24 * 60 * 60 * 1000) {
  cleanupExpiredTokens();
  const interval = setInterval(cleanupExpiredTokens, intervalMs);
  interval.unref();
  return interval;
}