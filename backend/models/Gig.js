import pool from '../config/db.js';

export async function listGigs() {
  const result = await pool.query(
    `SELECT g.id, g.provider_id, g.title, g.category, g.description,
            g.price_ngn, g.delivery_days, g.created_at,
            u.full_name AS provider_name,
            u.school_domain AS provider_domain
     FROM gigs g
     JOIN users u ON u.id = g.provider_id
     ORDER BY g.created_at DESC`
  );
  return result.rows;
}

export async function createGig({ providerId, title, category, description, priceNgn, deliveryDays }) {
  const result = await pool.query(
    `INSERT INTO gigs (provider_id, title, category, description, price_ngn, delivery_days)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, provider_id, title, category, description, price_ngn, delivery_days, created_at`,
    [providerId, title, category, description, priceNgn, deliveryDays]
  );
  return result.rows[0];
}