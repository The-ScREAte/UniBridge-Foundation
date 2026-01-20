import { supabase, cacheManager } from './supabaseClient';

// Authentication utilities
export const authService = {
  // Login with username and password
  login: async (username, password) => {
    // Simple authentication - in production, use proper backend auth
    const validUsername = 'admin';
    const validPassword = 'unibridge2025';
    
    if (username === validUsername && password === validPassword) {
      const authData = {
        isAuthenticated: true,
        username: username,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('unibridge_auth', JSON.stringify(authData));
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials' };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const authData = localStorage.getItem('unibridge_auth');
    if (!authData) return false;
    
    try {
      const parsed = JSON.parse(authData);
      return parsed.isAuthenticated === true;
    } catch {
      return false;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('unibridge_auth');
  },

  // Get current user info
  getCurrentUser: () => {
    const authData = localStorage.getItem('unibridge_auth');
    if (!authData) return null;
    
    try {
      return JSON.parse(authData);
    } catch {
      return null;
    }
  }
};

// Organization data management
export const organizationService = {
  // Get all organizations
  getAllOrganizations: async () => {
    // Check cache first
    const cacheKey = 'all_organizations';
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Try selecting optional link fields if present; fall back if schema doesn't have them.
    let data;
    let error;
    ({ data, error } = await supabase
      .from('organizations')
      .select('id, name, description, profile_image, partner_since, link_name, link_url, gallery, display_order, created_at, updated_at')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }));

    // Broadly detect missing link columns (Supabase may say schema cache instead of "does not exist")
    if (error && typeof error.message === 'string' && /link_(name|url)/i.test(error.message)) {
      ({ data, error } = await supabase
        .from('organizations')
        .select('id, name, description, profile_image, partner_since, gallery, display_order, created_at, updated_at')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false }));
    }

    if (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }
    
    // Transform snake_case to camelCase for frontend
    const transformed = (data || []).map(org => ({
      id: org.id,
      name: org.name,
      description: org.description,
      profileImage: org.profile_image,
      partnerSince: org.partner_since,
      linkName: org.link_name,
      linkUrl: org.link_url,
      gallery: org.gallery || [],      displayOrder: org.display_order,      createdAt: org.created_at,
      updatedAt: org.updated_at
    }));
    
    // Cache the result
    cacheManager.set(cacheKey, transformed);
    return transformed;
  },

  // Get organization by ID
  getOrganizationById: async (id) => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching organization:', error);
      return null;
    }
    
    // Transform snake_case to camelCase for frontend
    return data ? {
      id: data.id,
      name: data.name,
      description: data.description,
      profileImage: data.profile_image,
      partnerSince: data.partner_since,
      linkName: data.link_name,
      linkUrl: data.link_url,
      gallery: data.gallery,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;
  },

  // Add new organization
  addOrganization: async (orgData) => {
    // Transform camelCase to snake_case for database
    const newOrg = {
      name: orgData.name,
      description: orgData.description,
      profile_image: orgData.profileImage || orgData.profile_image,
      partner_since: orgData.partnerSince || orgData.partner_since,
      link_name: orgData.linkName || orgData.link_name,
      link_url: orgData.linkUrl || orgData.link_url,
      gallery: orgData.gallery || [],
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('organizations')
      .insert([newOrg])
      .select()
      .single();

    if (error) {
      console.error('Error adding organization:', error);
      throw new Error(error.message || 'Failed to add organization');
    }
    
    // Clear cache after adding
    cacheManager.clear('all_organizations');
    
    // Transform snake_case back to camelCase for frontend
    return data ? {
      id: data.id,
      name: data.name,
      description: data.description,
      profileImage: data.profile_image,
      partnerSince: data.partner_since,
      linkName: data.link_name,
      linkUrl: data.link_url,
      gallery: data.gallery,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } : null;
  },

  // Update organization
  updateOrganization: async (id, updatedData) => {
    // Transform camelCase to snake_case for database
    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    
    if (updatedData.name !== undefined) updatePayload.name = updatedData.name;
    if (updatedData.description !== undefined) updatePayload.description = updatedData.description;
    if (updatedData.profileImage !== undefined) updatePayload.profile_image = updatedData.profileImage;
    if (updatedData.profile_image !== undefined) updatePayload.profile_image = updatedData.profile_image;
    if (updatedData.partnerSince !== undefined) updatePayload.partner_since = updatedData.partnerSince;
    if (updatedData.partner_since !== undefined) updatePayload.partner_since = updatedData.partner_since;
    if (updatedData.linkName !== undefined) updatePayload.link_name = updatedData.linkName;
    if (updatedData.link_name !== undefined) updatePayload.link_name = updatedData.link_name;
    if (updatedData.linkUrl !== undefined) updatePayload.link_url = updatedData.linkUrl;
    if (updatedData.link_url !== undefined) updatePayload.link_url = updatedData.link_url;
    if (updatedData.gallery !== undefined) updatePayload.gallery = updatedData.gallery;

    if (Array.isArray(updatePayload.gallery)) {
      const normalizedGallery = [];
      for (const image of updatePayload.gallery) {
        if (image && typeof image.url === 'string' && image.url.startsWith('data:image')) {
          const upload = await imageUtils.uploadDataUrl(image.url, 'organization-images');
          if (upload.success) {
            normalizedGallery.push({
              ...image,
              url: upload.url,
              path: upload.path
            });
            continue;
          }
        }
        normalizedGallery.push(image);
      }
      updatePayload.gallery = normalizedGallery;
    }
    
    const { data, error } = await supabase
      .from('organizations')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating organization:', error);
      throw new Error(error.message || 'Failed to update organization');
    }
    
    // Clear cache after updating
    cacheManager.clear('all_organizations');
    cacheManager.clear(`organization_${id}`);
    
    // Return a simplified response to avoid re-fetching large data
    return { id, ...updatedData };
  },

  // Delete organization
  deleteOrganization: async (id) => {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting organization:', error);
      return false;
    }
    
    // Clear cache after deleting
    cacheManager.clear('all_organizations');
    cacheManager.clear(`organization_${id}`);
    return true;
  },

  // Add image to organization gallery
  addImageToOrganization: async (orgId, imageData) => {
    const org = await organizationService.getOrganizationById(orgId);
    if (!org) return null;

    const gallery = org.gallery || [];
    const newImage = {
      id: Date.now().toString(),
      ...imageData,
      addedAt: new Date().toISOString()
    };

    gallery.push(newImage);
    const updated = await organizationService.updateOrganization(orgId, { gallery });
    return updated ? newImage : null;
  },

  // Remove image from organization gallery
  removeImageFromOrganization: async (orgId, imageId) => {
    const org = await organizationService.getOrganizationById(orgId);
    if (!org || !org.gallery) return false;

    const gallery = org.gallery.filter(img => img.id !== imageId);
    const updated = await organizationService.updateOrganization(orgId, { gallery });
    return updated !== null;
  },

  // Update display order for multiple organizations
  updateDisplayOrder: async (organizations) => {
    try {
      const updates = organizations.map((org, index) => 
        supabase
          .from('organizations')
          .update({ display_order: index })
          .eq('id', org.id)
      );
      
      await Promise.all(updates);
      cacheManager.clear('all_organizations');
      return true;
    } catch (error) {
      console.error('Error updating display order:', error);
      return false;
    }
  }
};

// Image utilities for handling image uploads to Supabase Storage
export const imageUtils = {
  // Convert data URL to File
  dataUrlToFile: async (dataUrl, fileName = 'image') => {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  },

  // Upload data URL to Supabase Storage
  uploadDataUrl: async (dataUrl, bucket = 'organization-images') => {
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const file = await imageUtils.dataUrlToFile(dataUrl, `${fileName}.png`);
    return imageUtils.uploadImage(file, bucket);
  },

  // Upload image to Supabase Storage
  uploadImage: async (file, bucket = 'organization-images') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading image:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl, path: filePath };
  },

  // Upload video (or any file) to Supabase Storage
  uploadVideo: async (file, bucket = 'hero-media') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { contentType: file.type });

    if (error) {
      console.error('Error uploading video:', error);
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { success: true, url: publicUrlData.publicUrl, path: filePath };
  },

  // Delete image from Supabase Storage
  deleteImage: async (filePath, bucket = 'organization-images') => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    return true;
  },

  // Convert file to base64 string (for preview/backward compatibility)
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  },

  // Validate image file
  validateImageFile: (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)' };
    }
    
    // Optional: Add size limit (e.g., 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size should be less than 5MB' };
    }
    
    return { valid: true };
  }
};

// Team members management
export const teamService = {
  // Get all team members
  getAllMembers: async () => {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
    return data || [];
  },

  // Add team member
  addMember: async (memberData) => {
    const { data, error } = await supabase
      .from('team_members')
      .insert([memberData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding team member:', error);
      return null;
    }
    return data;
  },

  // Update team member
  updateMember: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('team_members')
      .update({ ...updatedData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating team member:', error);
      return null;
    }
    return data;
  },

  // Delete team member
  deleteMember: async (id) => {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting team member:', error);
      return false;
    }
    return true;
  },

  // Update display order for multiple team members
  updateDisplayOrder: async (members) => {
    try {
      const updates = members.map((member, index) => 
        supabase
          .from('team_members')
          .update({ display_order: index })
          .eq('id', member.id)
      );
      
      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Error updating display order:', error);
      return false;
    }
  }
};

// Contact messages management
export const messageService = {
  // Get all messages
  getAllMessages: async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  },

  // Add message
  addMessage: async (messageData) => {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding message:', error);
      return null;
    }
    return data;
  },

  // Update message (e.g., mark as read)
  updateMessage: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('contact_messages')
      .update(updatedData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating message:', error);
      return null;
    }
    return data;
  },

  // Delete message
  deleteMessage: async (id) => {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }
    return true;
  }
};

// Opportunities management
export const opportunityService = {
  // Get all opportunities
  getAllOpportunities: async () => {
    // Check cache first
    const cacheKey = 'all_opportunities';
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const { data, error } = await supabase
      .from('opportunities')
      .select('id, title, brief, details, image, location, duration, requirements, status, created_at, updated_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching opportunities:', error);
      return [];
    }
    
    // Cache the result
    const result = data || [];
    cacheManager.set(cacheKey, result);
    return result;
  },

  // Get opportunity by ID
  getOpportunityById: async (id) => {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching opportunity:', error);
      return null;
    }
    return data;
  },

  // Add opportunity
  addOpportunity: async (opportunityData) => {
    const { data, error } = await supabase
      .from('opportunities')
      .insert([opportunityData])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding opportunity:', error);
      return null;
    }
    
    // Clear cache after adding
    cacheManager.clear('all_opportunities');
    return data;
  },

  // Update opportunity
  updateOpportunity: async (id, updatedData) => {
    const { data, error } = await supabase
      .from('opportunities')
      .update({ ...updatedData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating opportunity:', error);
      return null;
    }
    
    // Clear cache after updating
    cacheManager.clear('all_opportunities');
    cacheManager.clear(`opportunity_${id}`);
    return data;
  },

  // Delete opportunity
  deleteOpportunity: async (id) => {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting opportunity:', error);
      return false;
    }
    return true;
  }
};

// About content management
export const aboutService = {
  // Get about content
  getAboutContent: async () => {
    // Check cache first
    const cacheKey = 'about_content';
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching about content:', error);
      // Return defaults if no content exists
      const defaults = {
        intro: "It's hard to believe people or know if your donation and help is getting into the right hands. This is where UniBridge comes in.",
        mission: 'UniBridge Foundation is a non-profit organization focused on finding opportunities for organizations and people who need them most. We serve as a bridge between those who want to help and those who need support.',
        what_we_do: 'We find, verify, and channel help to the right people and organizations. Our rigorous vetting process ensures that every donation, every resource, and every bit of support reaches verified recipients who truly need it.',
        volunteer_experience: 'While on the mission of helping, volunteers who join us will also experience safari trips during their service. We believe in creating meaningful connections not just with the communities we serve, but also with the beautiful environments we work in.'
      };
      cacheManager.set(cacheKey, defaults);
      return defaults;
    }
    
    // Cache the result
    cacheManager.set(cacheKey, data);
    return data;
  },

  // Update about content
  updateAboutContent: async (contentData) => {
    // First, try to get existing content
    const { data: existing } = await supabase
      .from('about_content')
      .select('id')
      .limit(1)
      .single();
    
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('about_content')
        .update({ ...contentData, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating about content:', error);
        return null;
      }
      // Clear cache after updating
      cacheManager.clear('about_content');
      return data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('about_content')
        .insert([contentData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating about content:', error);
        return null;
      }
      // Clear cache after creating
      cacheManager.clear('about_content');
      return data;
    }
  }
};

// Hero content management
export const heroService = {
  // Get hero content
  getHeroContent: async () => {
    const { data, error } = await supabase
      .from('hero_content')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching hero content:', error);
      // Return defaults if no content exists
      return {
        title: 'We Love Those You Love.',
        background_image: '/hero.png',
        background_video: null,
        use_video: false
      };
    }
    return data;
  },

  // Update hero content
  updateHeroContent: async (contentData) => {
    // First, try to get existing content
    const { data: existing } = await supabase
      .from('hero_content')
      .select('id')
      .limit(1)
      .single();
    
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('hero_content')
        .update({ ...contentData, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating hero content:', error);
        return null;
      }
      return data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('hero_content')
        .insert([contentData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating hero content:', error);
        return null;
      }
      return data;
    }
  }
};

// Intro video management
export const introVideoService = {
  // Get intro video
  getIntroVideo: async () => {
    const { data, error, status } = await supabase
      .from('intro_video')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .maybeSingle();

    if (error && status !== 406) {
      console.error('Error fetching intro video:', error);
    }

    if (!data) {
      return { video_url: null, is_active: false };
    }

    return {
      video_url: data.video_url || null,
      is_active: data.is_active === true
    };
  },

  // Update intro video
  updateIntroVideo: async (videoData) => {
    const { data: existing, error: fetchError, status } = await supabase
      .from('intro_video')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (fetchError && status !== 406) {
      console.error('Error checking intro video:', fetchError);
    }

    if (existing?.id) {
      const { data, error } = await supabase
        .from('intro_video')
        .update({ ...videoData, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating intro video:', error);
        return null;
      }
      return data;
    }

    const { data, error } = await supabase
      .from('intro_video')
      .insert([videoData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating intro video:', error);
      return null;
    }
    return data;
  }
};
