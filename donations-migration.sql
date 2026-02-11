-- Migration to add donations table
-- Run this in your Supabase SQL Editor

-- Create donations table
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

-- Add index for faster queries on active donations
CREATE INDEX IF NOT EXISTS idx_donations_active ON donations(is_active);
CREATE INDEX IF NOT EXISTS idx_donations_display_order ON donations(display_order);

-- Enable Row Level Security
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active donations
CREATE POLICY "Allow public read access to active donations"
  ON donations
  FOR SELECT
  USING (is_active = true);

-- Create policy to allow authenticated users (admins) full access
-- Note: Adjust this based on your authentication setup
CREATE POLICY "Allow authenticated users full access to donations"
  ON donations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_donations_updated_at
  BEFORE UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create donation-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('donation-images', 'donation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for donation images
DROP POLICY IF EXISTS "Public can view donation images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload donation images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete donation images" ON storage.objects;

CREATE POLICY "Public can view donation images"
ON storage.objects FOR SELECT
USING (bucket_id = 'donation-images');

CREATE POLICY "Anyone can upload donation images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'donation-images');

CREATE POLICY "Anyone can delete donation images"
ON storage.objects FOR DELETE
USING (bucket_id = 'donation-images');

-- Success message
SELECT 'Donations table created successfully!' AS message;
