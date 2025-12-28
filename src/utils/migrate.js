// Migration utility to transfer data from localStorage to Supabase
// Run this in your browser console to migrate existing data

import { supabase } from './supabaseClient';

export const migrateLocalStorageToSupabase = async () => {
  console.log('Starting migration from localStorage to Supabase...');
  
  try {
    // Get organizations from localStorage
    const localOrgs = localStorage.getItem('unibridge_organizations');
    
    if (!localOrgs) {
      console.log('No organizations found in localStorage');
      return { success: true, message: 'No data to migrate' };
    }

    const organizations = JSON.parse(localOrgs);
    console.log(`Found ${organizations.length} organizations to migrate`);

    // Migrate each organization
    const results = [];
    for (const org of organizations) {
      // Remove the old id since Supabase will generate a new UUID
      const { id, createdAt, updatedAt, ...orgData } = org;
      
      // Transform field names to match Supabase schema
      const supabaseOrg = {
        name: orgData.name,
        description: orgData.description,
        profile_image: orgData.profileImage,
        partner_since: orgData.partnerSince,
        gallery: orgData.gallery || [],
        created_at: createdAt || new Date().toISOString()
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('organizations')
        .insert([supabaseOrg])
        .select()
        .single();

      if (error) {
        console.error(`Error migrating ${orgData.name}:`, error);
        results.push({ org: orgData.name, success: false, error: error.message });
      } else {
        console.log(`✓ Migrated ${orgData.name}`);
        results.push({ org: orgData.name, success: true, id: data.id });
      }
    }

    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\n=== Migration Summary ===');
    console.log(`Total: ${organizations.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    
    if (failed === 0) {
      console.log('\n✓ All data migrated successfully!');
      console.log('You can now clear your localStorage or keep it as backup.');
      console.log('To clear: localStorage.removeItem("unibridge_organizations")');
    }

    return {
      success: failed === 0,
      total: organizations.length,
      successful,
      failed,
      results
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to backup localStorage data
export const backupLocalStorage = () => {
  const backup = {
    organizations: localStorage.getItem('unibridge_organizations'),
    auth: localStorage.getItem('unibridge_auth'),
    team: localStorage.getItem('unibridge_team'),
    messages: localStorage.getItem('unibridge_messages'),
    opportunities: localStorage.getItem('unibridge_opportunities'),
    timestamp: new Date().toISOString()
  };
  
  // Download as JSON file
  const dataStr = JSON.stringify(backup, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `unibridge-backup-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('Backup downloaded successfully!');
  return backup;
};

// Usage instructions
console.log('=== UniBridge LocalStorage to Supabase Migration ===');
console.log('');
console.log('To migrate your data:');
console.log('1. First, backup your data: backupLocalStorage()');
console.log('2. Then migrate: migrateLocalStorageToSupabase()');
console.log('');
console.log('Make sure you have run the SQL setup script in Supabase first!');
