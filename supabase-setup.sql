-- UniBridge Foundation - Complete Database Setup
-- Copy and paste this entire file into Supabase SQL Editor and click RUN

-- ============================================
-- 1. ORGANIZATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  profile_image TEXT,
  partner_since TEXT,
  link_name TEXT,
  link_url TEXT,
  gallery JSONB DEFAULT '[]'::jsonb,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Recreate policies safely if script is rerun
DROP POLICY IF EXISTS "Public can view organizations" ON organizations;
DROP POLICY IF EXISTS "Anyone can insert organizations" ON organizations;
DROP POLICY IF EXISTS "Anyone can update organizations" ON organizations;
DROP POLICY IF EXISTS "Anyone can delete organizations" ON organizations;

CREATE POLICY "Public can view organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert organizations" ON organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update organizations" ON organizations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete organizations" ON organizations FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS organizations_created_at_idx ON organizations(created_at DESC);

-- ============================================
-- 2. TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image TEXT,
  bio TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view team members" ON team_members;
DROP POLICY IF EXISTS "Anyone can insert team members" ON team_members;
DROP POLICY IF EXISTS "Anyone can update team members" ON team_members;
DROP POLICY IF EXISTS "Anyone can delete team members" ON team_members;

CREATE POLICY "Public can view team members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Anyone can insert team members" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update team members" ON team_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete team members" ON team_members FOR DELETE USING (true);

-- ============================================
-- 3. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can view messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON contact_messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON contact_messages;

CREATE POLICY "Anyone can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view messages" ON contact_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can update messages" ON contact_messages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete messages" ON contact_messages FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON contact_messages(status);

-- ============================================
-- 4. OPPORTUNITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  brief TEXT,
  details TEXT,
  image TEXT,
  location TEXT,
  duration TEXT,
  requirements TEXT,
  display_order INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backfill column for existing databases
ALTER TABLE opportunities ADD COLUMN IF NOT EXISTS display_order INT;

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view opportunities" ON opportunities;
DROP POLICY IF EXISTS "Anyone can insert opportunities" ON opportunities;
DROP POLICY IF EXISTS "Anyone can update opportunities" ON opportunities;
DROP POLICY IF EXISTS "Anyone can delete opportunities" ON opportunities;

CREATE POLICY "Public can view opportunities" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Anyone can insert opportunities" ON opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update opportunities" ON opportunities FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete opportunities" ON opportunities FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS opportunities_status_idx ON opportunities(status);
CREATE INDEX IF NOT EXISTS opportunities_display_order_idx ON opportunities(display_order);
CREATE INDEX IF NOT EXISTS opportunities_created_at_idx ON opportunities(created_at DESC);

-- ============================================
-- 5. ABOUT CONTENT TABLE (Single Row Config)
-- ============================================
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intro TEXT,
  mission TEXT,
  what_we_do TEXT,
  volunteer_experience TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view about content" ON about_content;
DROP POLICY IF EXISTS "Anyone can insert about content" ON about_content;
DROP POLICY IF EXISTS "Anyone can update about content" ON about_content;

CREATE POLICY "Public can view about content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Anyone can insert about content" ON about_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update about content" ON about_content FOR UPDATE USING (true) WITH CHECK (true);

-- Insert default about content row
INSERT INTO about_content (intro, mission, what_we_do, volunteer_experience)
VALUES (
  'Welcome to UniBridge Foundation',
  'Our mission is to connect communities',
  'We facilitate meaningful partnerships',
  'Join us in making a difference'
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. HERO CONTENT TABLE (Single Row Config)
-- ============================================
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT DEFAULT 'We Love Those You Love.',
  background_image TEXT,
  background_video TEXT,
  use_video BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view hero content" ON hero_content;
DROP POLICY IF EXISTS "Anyone can insert hero content" ON hero_content;
DROP POLICY IF EXISTS "Anyone can update hero content" ON hero_content;

CREATE POLICY "Public can view hero content" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Anyone can insert hero content" ON hero_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update hero content" ON hero_content FOR UPDATE USING (true) WITH CHECK (true);

-- Insert default hero content row
INSERT INTO hero_content (title, background_image, use_video)
VALUES (
  'We Love Those You Love.',
  '/hero.png',
  false
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. INTRO VIDEO TABLE (Single Row Config)
-- ============================================
CREATE TABLE IF NOT EXISTS intro_video (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_url TEXT,
  poster_url TEXT,
  title TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE intro_video ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view intro video" ON intro_video;
DROP POLICY IF EXISTS "Anyone can insert intro video" ON intro_video;
DROP POLICY IF EXISTS "Anyone can update intro video" ON intro_video;

CREATE POLICY "Public can view intro video" ON intro_video FOR SELECT USING (true);
CREATE POLICY "Anyone can insert intro video" ON intro_video FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update intro video" ON intro_video FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================
-- 8. STORAGE BUCKETS
-- ============================================
-- Run these commands in Supabase Storage UI or via SQL:

-- Create organization-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('organization-images', 'organization-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create team-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create opportunity-images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('opportunity-images', 'opportunity-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create hero-media bucket for background images and videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-media', 'hero-media', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. STORAGE POLICIES
-- ============================================

-- Organization images policies
DROP POLICY IF EXISTS "Public can view organization images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload organization images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update organization images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete organization images" ON storage.objects;

CREATE POLICY "Public can view organization images"
ON storage.objects FOR SELECT
USING (bucket_id = 'organization-images');

CREATE POLICY "Anyone can upload organization images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'organization-images');

CREATE POLICY "Anyone can update organization images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'organization-images');

CREATE POLICY "Anyone can delete organization images"
ON storage.objects FOR DELETE
USING (bucket_id = 'organization-images');

-- Team images policies
DROP POLICY IF EXISTS "Public can view team images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload team images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete team images" ON storage.objects;

CREATE POLICY "Public can view team images"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-images');

CREATE POLICY "Anyone can upload team images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'team-images');

CREATE POLICY "Anyone can delete team images"
ON storage.objects FOR DELETE
USING (bucket_id = 'team-images');

-- Opportunity images policies
DROP POLICY IF EXISTS "Public can view opportunity images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload opportunity images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete opportunity images" ON storage.objects;

CREATE POLICY "Public can view opportunity images"
ON storage.objects FOR SELECT
USING (bucket_id = 'opportunity-images');

CREATE POLICY "Anyone can upload opportunity images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'opportunity-images');

CREATE POLICY "Anyone can delete opportunity images"
ON storage.objects FOR DELETE
USING (bucket_id = 'opportunity-images');

-- Hero media policies
DROP POLICY IF EXISTS "Public can view hero media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload hero media" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete hero media" ON storage.objects;

CREATE POLICY "Public can view hero media"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-media');

CREATE POLICY "Anyone can upload hero media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'hero-media');

CREATE POLICY "Anyone can delete hero media"
ON storage.objects FOR DELETE
USING (bucket_id = 'hero-media');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- All tables, policies, and storage buckets are now configured.
-- Your UniBridge Foundation app is ready to use Supabase!
