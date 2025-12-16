-- ============================================
-- LocaList Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Tables
-- ============================================

-- Pin Categories
CREATE TABLE localist_pin_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pins
CREATE TABLE localist_pins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES localist_pin_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  photo_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE localist_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pin_id UUID NOT NULL REFERENCES localist_pins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pin_id, user_id)
);

-- Favorites
CREATE TABLE localist_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pin_id UUID NOT NULL REFERENCES localist_pins(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pin_id, user_id)
);

-- Review Upvotes
CREATE TABLE localist_review_upvotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES localist_reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- ============================================
-- Indexes
-- ============================================

CREATE INDEX idx_pins_user_id ON localist_pins(user_id);
CREATE INDEX idx_pins_category_id ON localist_pins(category_id);
CREATE INDEX idx_pins_location ON localist_pins(latitude, longitude);
CREATE INDEX idx_pins_is_public ON localist_pins(is_public);
CREATE INDEX idx_pins_created_at ON localist_pins(created_at DESC);

CREATE INDEX idx_reviews_pin_id ON localist_reviews(pin_id);
CREATE INDEX idx_reviews_user_id ON localist_reviews(user_id);
CREATE INDEX idx_reviews_created_at ON localist_reviews(created_at DESC);

CREATE INDEX idx_favorites_pin_id ON localist_favorites(pin_id);
CREATE INDEX idx_favorites_user_id ON localist_favorites(user_id);

CREATE INDEX idx_review_upvotes_review_id ON localist_review_upvotes(review_id);
CREATE INDEX idx_review_upvotes_user_id ON localist_review_upvotes(user_id);

-- ============================================
-- Functions
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_localist_pins_updated_at
  BEFORE UPDATE ON localist_pins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_localist_reviews_updated_at
  BEFORE UPDATE ON localist_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE localist_pin_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE localist_pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE localist_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE localist_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE localist_review_upvotes ENABLE ROW LEVEL SECURITY;

-- Pin Categories: Everyone can read
CREATE POLICY "Pin categories are viewable by everyone"
  ON localist_pin_categories FOR SELECT
  USING (true);

-- Pins: Public pins viewable by everyone
CREATE POLICY "Public pins are viewable by everyone"
  ON localist_pins FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

-- Pins: Users can create their own pins
CREATE POLICY "Users can create their own pins"
  ON localist_pins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pins: Users can update their own pins
CREATE POLICY "Users can update their own pins"
  ON localist_pins FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pins: Users can delete their own pins
CREATE POLICY "Users can delete their own pins"
  ON localist_pins FOR DELETE
  USING (auth.uid() = user_id);

-- Reviews: Everyone can read reviews of public pins
CREATE POLICY "Reviews are viewable by everyone"
  ON localist_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM localist_pins
      WHERE localist_pins.id = localist_reviews.pin_id
      AND (localist_pins.is_public = true OR localist_pins.user_id = auth.uid())
    )
  );

-- Reviews: Users can create reviews
CREATE POLICY "Users can create reviews"
  ON localist_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Reviews: Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON localist_reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reviews: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON localist_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites: Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON localist_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Favorites: Users can create their own favorites
CREATE POLICY "Users can create their own favorites"
  ON localist_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Favorites: Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON localist_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Review Upvotes: Everyone can see upvotes
CREATE POLICY "Review upvotes are viewable by everyone"
  ON localist_review_upvotes FOR SELECT
  USING (true);

-- Review Upvotes: Users can create upvotes
CREATE POLICY "Users can create upvotes"
  ON localist_review_upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Review Upvotes: Users can delete their own upvotes
CREATE POLICY "Users can delete their own upvotes"
  ON localist_review_upvotes FOR DELETE
  USING (auth.uid() = user_id);

