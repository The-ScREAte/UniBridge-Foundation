# Quick Start: Donation Feature

## Step 1: Setup Database (One-time)
1. Open your Supabase project
2. Go to SQL Editor
3. Copy and paste the contents from `donations-migration.sql`
4. Click **RUN** to create the donations table

## Step 2: Create Your First Donation
1. Navigate to your site's admin login: `http://localhost:5173/admin` (or your production URL)
2. Login with your admin credentials
3. Click on the **"Donations"** tab
4. Click **"Add Donation"** button
5. Fill in the form:
   ```
   Donation Name: Support Clean Water Initiative
   Donation Link: https://www.gofundme.com/your-campaign
   Description: Help us bring clean water to 500 families in rural Kenya. Every donation provides safe drinking water.
   ```
6. Upload an image (optional but recommended)
7. Check **"Make this donation active on the site"**
8. Click **"Create Donation"**

## Step 3: View on Your Site
1. Go to the homepage
2. Scroll down - you'll see your donation banner between Opportunities and About sections
3. Check the footer - the "Donate" button now links to your campaign

## Managing Donations

### To Activate/Deactivate
- Click the green "Active" or gray "Inactive" button next to any donation
- Active donations show on the site immediately
- Inactive donations are hidden but saved

### To Edit
- Click the blue "Edit" button
- Update any fields
- Click "Update Donation"

### To Reorder
- Simply drag and drop donations to reorder them
- The first active donation appears in the footer button
- All active donations show in the home page banner

### To Delete
- Click the red "Delete" button
- Confirm the deletion
- This is permanent (consider deactivating instead)

## Tips
✅ **DO**:
- Use clear, compelling donation names
- Keep descriptions short (2-3 sentences)
- Use high-quality images
- Test donation links before activating
- Deactivate completed campaigns

❌ **DON'T**:
- Don't delete campaigns (deactivate them instead)
- Don't activate broken links
- Don't use very large images (keep under 5MB)

## Example Donation Campaigns

### Campaign 1: Education
```
Name: School Supplies for 100 Children
Link: https://www.gofundme.com/school-supplies-kenya
Description: Provide backpacks, notebooks, and pencils for 100 students starting school this fall. Your $50 donation fully equips one child for the year.
Image: [Photo of children with school supplies]
```

### Campaign 2: Medical
```
Name: Mobile Clinic Expansion
Link: https://www.paypal.com/donate/mobile-clinic
Description: Help us expand our mobile medical clinic to reach 5 remote villages. Donations fund medical supplies, fuel, and healthcare worker stipends.
Image: [Photo of medical clinic van]
```

### Campaign 3: Emergency
```
Name: Flood Relief Fund
Link: https://donate.stripe.com/flood-relief
Description: Urgent: Provide emergency shelter, food, and clean water to 200 families affected by recent flooding. Every dollar helps rebuild lives.
Image: [Photo showing community recovery efforts]
```

## Troubleshooting

**Q: I created a donation but don't see it on the homepage**
- A: Make sure the donation is marked as "Active" (green button)

**Q: Can I have multiple active donations?**
- A: Yes! All active donations show on the homepage banner

**Q: Which donation appears in the footer?**
- A: The first active donation (topmost in the admin list)

**Q: Can I change the order of donations?**
- A: Yes, just drag and drop them in the admin panel

## Need Help?
Refer to `DONATION_FEATURE.md` for detailed documentation.
