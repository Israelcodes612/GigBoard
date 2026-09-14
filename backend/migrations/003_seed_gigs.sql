-- Seed the board with sample gigs so it isn't empty on first run.
-- Provider is the oldest user; skipped if no users exist yet.
INSERT INTO gigs (provider_id, title, category, description, price_ngn, delivery_days)
SELECT
  u.id,
  s.title,
  s.category,
  s.description,
  s.price_ngn,
  s.delivery_days
FROM (VALUES
  ('Design',   'I''ll design your logo',              'Clean, simple logo design with 2 concepts and up to 2 rounds of revisions. Delivered as PNG and SVG.', 4000,  '3 days'),
  ('Repairs',  'Laptop screen & battery fix',          'Fast, careful hardware fixes for common laptop screen and battery issues. Parts are quoted before work starts.', 6500, '1 day'),
  ('Writing',  'Essay editing & proofreading',         'Clearer structure, stronger grammar, and a final proofread for essays, applications, and personal projects.', 2000, '2 days'),
  ('Dev',      'Build you a simple landing page',      'A polished, responsive landing page for your project or small business, built with clean modern code.', 12000, '5 days'),
  ('Tutoring', '1-on-1 calculus tutoring',             'Patient, one-on-one help with calculus topics, past questions, and building confidence before exams.', 1500, 'Flexible'),
  ('Dev',      'Debug your school project code',       'Find the bug, explain what happened, and get your project back on track without the mystery.', 3000, '2 days')
) AS s(category, title, description, price_ngn, delivery_days)
CROSS JOIN (SELECT id FROM users ORDER BY created_at LIMIT 1) u
WHERE NOT EXISTS (SELECT 1 FROM gigs);