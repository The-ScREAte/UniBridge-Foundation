-- Quick database check - run this in Supabase SQL Editor

-- Check if tables exist and have data
SELECT 'organizations' as table_name, COUNT(*) as row_count FROM organizations
UNION ALL
SELECT 'opportunities', COUNT(*) FROM opportunities
UNION ALL
SELECT 'team_members', COUNT(*) FROM team_members
UNION ALL
SELECT 'donations', COUNT(*) FROM donations;

-- Show first 3 organizations (if any exist)
SELECT id, name, created_at FROM organizations LIMIT 3;

-- Show first 3 opportunities (if any exist)
SELECT id, title, created_at FROM opportunities LIMIT 3;
