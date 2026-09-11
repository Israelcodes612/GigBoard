import pool from '../config/db.js';

export async function createUser({ fullName, email, passwordHash, schoolDomain }) {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, school_domain)
     VALUES ($1, $2, $3, $4)
     RETURNING id, full_name, email, school_domain, role, is_verified, created_at`,
    [fullName, email, passwordHash, schoolDomain]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

export async function findUserById(id) {
  const result = await pool.query(
    `SELECT id, full_name, email, school_domain, role, is_verified, created_at
     FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}