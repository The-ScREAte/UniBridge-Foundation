-- Fix Database Migration
-- Run this in your Supabase SQL Editor to fix donation issues and add missing fields

-- ============================================
-- 1. Add is_active field to team_members if missing
-- ============================================
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing team members to be active by default
UPDATE team_members SET is_active = true WHERE is_active IS NULL;

-- ============================================
-- 2. Create donations table if it doesn't exist
-- ============================================
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  link TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  is_active BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_donations_active ON donations(is_active);
CREATE INDEX IF NOT EXISTS idx_donations_display_order ON donations(display_order);

-- Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active donations" ON donations;
DROP POLICY IF EXISTS "Allow authenticated users full access to donations" ON donations;
DROP POLICY IF EXISTS "Public can view donations" ON donations;
DROP POLICY IF EXISTS "Anyone can insert donations" ON donations;
DROP POLICY IF EXISTS "Anyone can update donations" ON donations;
DROP POLICY IF EXISTS "Anyone can delete donations" ON donations;

-- Create policies to allow full public access (like other tables)
CREATE POLICY "Public can view donations" ON donations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update donations" ON donations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete donations" ON donations FOR DELETE USING (true);

-- Add trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_donations_updated_at ON donations;
CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. Create donation-images storage bucket
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('donation-images', 'donation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for donation images
DROP POLICY IF EXISTS "Public can view donation images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload donation images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update donation images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete donation images" ON storage.objects;

CREATE POLICY "Public can view donation images"
ON storage.objects FOR SELECT
USING (bucket_id = 'donation-images');

CREATE POLICY "Anyone can upload donation images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'donation-images');

CREATE POLICY "Anyone can update donation images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'donation-images');

CREATE POLICY "Anyone can delete donation images"
ON storage.objects FOR DELETE
USING (bucket_id = 'donation-images');

-- ============================================
-- Success!
-- ============================================
SELECT 'Database fixed successfully! You can now save donations and use team member active/inactive feature.' AS message;
