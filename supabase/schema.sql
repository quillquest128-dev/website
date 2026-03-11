-- ============================================================
-- LazoStore – Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─── Categories ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Anyone can read categories
CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

-- Only authenticated users (admins) can modify
CREATE POLICY "categories_insert_admin" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "categories_update_admin" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "categories_delete_admin" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');


-- ─── Products ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  short_description    TEXT NOT NULL DEFAULT '',
  full_description     TEXT NOT NULL DEFAULT '',
  price                DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_price       DECIMAL(10,2),
  thumbnail            TEXT,
  gallery_images       TEXT[] DEFAULT '{}',
  category_id          UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags                 TEXT[] DEFAULT '{}',
  stock_quantity       INT NOT NULL DEFAULT 0,
  minimum_quantity     INT NOT NULL DEFAULT 1,
  status               TEXT NOT NULL DEFAULT 'active'
                         CHECK (status IN ('active', 'inactive', 'out_of_stock')),
  featured             BOOLEAN NOT NULL DEFAULT FALSE,
  delivery_info        TEXT DEFAULT '',
  discord_payment_note TEXT DEFAULT '',
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_select_active" ON products
  FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

CREATE POLICY "products_insert_admin" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "products_update_admin" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "products_delete_admin" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Index for performance
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);


-- ─── Order Requests ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  discord_username TEXT,
  quantity          INT NOT NULL DEFAULT 1,
  order_status     TEXT NOT NULL DEFAULT 'pending'
                     CHECK (order_status IN ('pending', 'contacted', 'completed', 'cancelled')),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER order_requests_updated_at
  BEFORE UPDATE ON order_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE order_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT (place an order)
CREATE POLICY "orders_insert_public" ON order_requests
  FOR INSERT WITH CHECK (true);

-- Only admins can read/update/delete
CREATE POLICY "orders_select_admin" ON order_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "orders_update_admin" ON order_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "orders_delete_admin" ON order_requests
  FOR DELETE USING (auth.role() = 'authenticated');


-- ─── Site Settings ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT NOT NULL UNIQUE,
  value      TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "settings_select_all" ON site_settings
  FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "settings_insert_admin" ON site_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "settings_update_admin" ON site_settings
  FOR UPDATE USING (auth.role() = 'authenticated');


-- ─── Seed Data ───────────────────────────────────────────────

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('discord_link', 'https://discord.gg/your-server'),
  ('store_name', 'LazoStore'),
  ('store_tagline', 'Premium digital products, delivered via Discord')
ON CONFLICT (key) DO NOTHING;

-- Sample categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Software', 'software', 'Digital tools and applications', '💻'),
  ('Gaming', 'gaming', 'Game accounts, keys, and boosting services', '🎮'),
  ('Design', 'design', 'Templates, assets, and design resources', '🎨'),
  ('Education', 'education', 'Courses, guides, and learning materials', '📚'),
  ('Accounts', 'accounts', 'Premium platform accounts and subscriptions', '🔑')
ON CONFLICT (slug) DO NOTHING;

-- Sample products (uses category IDs from above)
-- You may need to update category_id values based on your actual generated UUIDs
-- After running, check: SELECT id, name FROM categories;

WITH cat AS (
  SELECT id, slug FROM categories
)
INSERT INTO products (
  title, slug, short_description, full_description,
  price, discount_price, thumbnail,
  category_id, tags, stock_quantity, status, featured,
  delivery_info, discord_payment_note
)
SELECT
  'Premium VPN Subscription',
  'premium-vpn-subscription',
  'Full-featured VPN with 50+ servers in 30 countries. 1-year subscription.',
  'Get full access to our premium VPN service with servers in 30+ countries, unlimited bandwidth, and military-grade encryption. Perfect for privacy-conscious users.',
  29.99, 19.99, NULL,
  (SELECT id FROM cat WHERE slug = 'software'),
  ARRAY['vpn', 'privacy', 'security'], 50, 'active', true,
  'Delivered via Discord within 1 hour of payment.',
  'Please DM us on Discord after joining. Payment via crypto or PayPal accepted.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'premium-vpn-subscription');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (
  title, slug, short_description, full_description,
  price, discount_price, thumbnail,
  category_id, tags, stock_quantity, status, featured,
  delivery_info, discord_payment_note
)
SELECT
  'Spotify Premium Account',
  'spotify-premium-account',
  'Genuine Spotify Premium individual account. Ad-free, offline mode, high quality audio.',
  'Enjoy uninterrupted music with a Spotify Premium account. No ads, download your favorites for offline listening, and experience HD audio quality.',
  12.99, NULL, NULL,
  (SELECT id FROM cat WHERE slug = 'accounts'),
  ARRAY['spotify', 'music', 'streaming'], 20, 'active', true,
  'Account credentials delivered via Discord within 30 minutes.',
  'After joining Discord, open a ticket and mention this product. Payment via PayPal or crypto.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'spotify-premium-account');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (
  title, slug, short_description, full_description,
  price, discount_price, thumbnail,
  category_id, tags, stock_quantity, status, featured,
  delivery_info, discord_payment_note
)
SELECT
  'Figma UI Kit – Neon Dark',
  'figma-ui-kit-neon-dark',
  'Professional Figma UI kit with 200+ dark-themed components in neon style.',
  'Comprehensive Figma UI kit featuring over 200 carefully crafted components in a stunning neon dark theme. Includes buttons, cards, modals, forms, navigation elements, and more.',
  24.99, 14.99, NULL,
  (SELECT id FROM cat WHERE slug = 'design'),
  ARRAY['figma', 'design', 'ui-kit', 'dark-theme'], 100, 'active', true,
  'Figma file link delivered via Discord instantly after payment.',
  'Share your Figma email or Discord username. We will grant you access to the file immediately.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'figma-ui-kit-neon-dark');

WITH cat AS (SELECT id, slug FROM categories)
INSERT INTO products (
  title, slug, short_description, full_description,
  price, discount_price, thumbnail,
  category_id, tags, stock_quantity, status, featured,
  delivery_info, discord_payment_note
)
SELECT
  'Valorant Account – Platinum',
  'valorant-account-platinum',
  'Ranked Valorant account at Platinum level with multiple agents unlocked.',
  'Get a head start in Valorant with this Platinum-ranked account. Comes with multiple agents, skins, and a clean history. All credentials changed on delivery.',
  49.99, NULL, NULL,
  (SELECT id FROM cat WHERE slug = 'gaming'),
  ARRAY['valorant', 'gaming', 'account', 'fps'], 5, 'active', false,
  'Account credentials changed and sent via Discord within 2 hours.',
  'Open a ticket on Discord after joining. We will verify stock and process your order manually.'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'valorant-account-platinum');

-- ============================================================
-- ADMIN USER SETUP
-- ============================================================
-- To create your admin user:
-- 1. Go to your Supabase Dashboard → Authentication → Users
-- 2. Click "Invite user" and enter your admin email
-- 3. Or use: supabase auth admin create --email admin@example.com --password yourpassword
-- 4. Log in at /admin/login with those credentials
-- ============================================================
