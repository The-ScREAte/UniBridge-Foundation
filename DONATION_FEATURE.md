# Donation Management Feature

## Overview
A comprehensive donation management system for UniBridge Foundation that allows administrators to create, manage, and display multiple donation campaigns throughout the site.

## Features

### Admin Dashboard
- **Create Donations**: Add new donation campaigns with:
  - Name (required)
  - Donation link/URL (required)
  - Short description (required)
  - Campaign image (optional)
  - Active/Inactive status toggle
  
- **Manage Donations**: 
  - View all donations in a list
  - Edit existing donations
  - Delete donations
  - Toggle active/inactive status with one click
  - Drag and drop to reorder donations
  - Visual indicator showing active (green) vs inactive (gray) donations

### Public Display
- **Home Page**: Dedicated donation banner section showing all active donations
  - Displays donation campaigns in a grid layout
  - Shows campaign image, name, description
  - "Donate Now" button linking to external donation page
  - Automatically hidden if no active donations

- **Footer**: Dynamic donation button
  - Uses the first active donation link
  - Falls back to email if no active donations
  - Consistent across all pages

## Setup Instructions

### 1. Database Setup
Run the SQL migration in your Supabase SQL Editor:

```bash
# The migration file is located at:
donations-migration.sql
```

Or run this SQL directly in Supabase:

```sql
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

CREATE INDEX IF NOT EXISTS idx_donations_active ON donations(is_active);
CREATE INDEX IF NOT EXISTS idx_donations_display_order ON donations(display_order);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to active donations"
  ON donations FOR SELECT
  USING (is_active = true);

CREATE POLICY "Allow authenticated users full access to donations"
  ON donations FOR ALL
  USING (true) WITH CHECK (true);
```

### 2. Access the Admin Panel
1. Navigate to `/admin`
2. Log in with admin credentials
3. Click on the **"Donations"** tab

### 3. Create Your First Donation
1. Click **"Add Donation"** button
2. Fill in the form:
   - **Donation Name**: e.g., "Support Education in Kenya"
   - **Donation Link**: External URL where users will donate (e.g., GoFundMe, PayPal, etc.)
   - **Description**: Brief explanation of the campaign
   - **Image**: Upload a campaign image (recommended 800x400px)
   - **Active Status**: Check the box to make it visible on the site
3. Click **"Create Donation"**

## Usage Guide

### Managing Multiple Donations
You can create as many donation campaigns as needed. Each can be:
- **Activated** individually to show on the site
- **Deactivated** to hide without deleting
- **Reordered** by drag and drop
- **Edited** to update details
- **Deleted** permanently

### Best Practices
1. **Keep descriptions concise** (2-3 sentences)
2. **Use high-quality images** that represent the cause
3. **Test donation links** before activating
4. **Deactivate completed campaigns** instead of deleting (for records)
5. **Order strategically** - first donation appears in footer

### Display Logic
- **Active donations** appear on:
  - Home page donation banner (all active donations)
  - Footer donate button (first active donation)
  
- **Inactive donations**:
  - Only visible in admin dashboard
  - Not shown to public visitors
  - Preserved for future reactivation

## File Structure

### New Files Created
```
src/
  components/
    DonationBanner.jsx          # Displays active donations on home page
  utils/
    storage.js                   # Added donationService (lines ~1093+)

donations-migration.sql          # Database setup SQL
DONATION_FEATURE.md             # This file
```

### Modified Files
```
src/
  pages/
    AdminDashboard.jsx          # Added donations tab and management UI
    Home.jsx                    # Added DonationBanner component
  components/
    Footer.jsx                  # Dynamic donation button using active donations
```

## API Functions (storage.js)

### donationService
- `getAllDonations()` - Get all donations (admin view)
- `getActiveDonations()` - Get only active donations (public view)
- `addDonation(data)` - Create new donation
- `updateDonation(id, data)` - Update existing donation
- `toggleActive(id, status)` - Toggle active/inactive status
- `deleteDonation(id)` - Delete donation
- `updateDisplayOrder(donations)` - Update sort order after drag/drop

## Troubleshooting

### Donations not showing on homepage
- Verify donation is marked as **Active** in admin dashboard
- Check browser console for errors
- Confirm database migration was successful

### Can't create donations
- Verify you're logged into admin panel
- Check that all required fields are filled
- Confirm database table exists and has correct permissions

### Images not displaying
- Ensure image is uploaded before saving
- Try smaller image file sizes (< 5MB recommended)
- Check image format is supported (JPG, PNG, WebP)

## Future Enhancements
Potential features to add:
- Donation goal tracking with progress bars
- Analytics (views, clicks, conversion tracking)
- Scheduled activation/deactivation
- Category/tags for donations
- Email notifications when donations are created/activated

## Support
For issues or questions:
- Check the main README.md
- Review Supabase dashboard for database errors
- Verify admin authentication is working
