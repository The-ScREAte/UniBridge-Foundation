# 🚀 Quick Start - Supabase Setup (2 Minutes)

## Step 1: Run SQL Script (1 minute)

1. Click this link: https://supabase.com/dashboard/project/kkulcycejraywlvvemhj/sql/new
2. Copy all the text from the `supabase-setup.sql` file
3. Paste it into the SQL editor
4. Click **RUN** button (or press Cmd+Enter)
5. You should see "Success. No rows returned"

## Step 2: Test Your App (1 minute)

1. Your dev server is already running at: http://localhost:3000/
2. Click "Admin" in the navigation
3. Login with:
   - Username: `admin`
   - Password: `unibridge2025`
4. Click "Add Organization" and fill out the form
5. Click Save

## Step 3: Verify in Supabase

1. Go to: https://supabase.com/dashboard/project/kkulcycejraywlvvemhj/editor
2. Click on `organizations` table
3. You should see your new organization! 🎉

---

## That's It! You're Done! ✅

Your app now stores data in Supabase instead of localStorage.

### Optional: Setup Image Storage

If you want to upload images to Supabase Storage (instead of base64):

1. Go to: https://supabase.com/dashboard/project/kkulcycejraywlvvemhj/storage/buckets
2. Click **New Bucket**
3. Name: `organization-images`
4. Make it Public: ✓
5. Click **Create**

---

## Need More Help?

- **Full Guide**: See `SUPABASE_SETUP.md`
- **Migration**: See `src/utils/migrate.js` to move existing data
- **Supabase Docs**: https://supabase.com/docs

## Common Issues

**"Failed to fetch"** → You forgot to run the SQL script (Step 1)

**"RLS Policy"** → The SQL script should handle this automatically

**"Table doesn't exist"** → Run the SQL script again

---

Enjoy your new cloud-powered app! 🎊
