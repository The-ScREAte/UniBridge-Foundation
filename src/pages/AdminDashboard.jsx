import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, organizationService, imageUtils, teamService, messageService, opportunityService, aboutService, heroService, introVideoService } from '../utils/storage';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('organizations'); // 'organizations', 'team', 'content', or 'opportunities'
  const [organizations, setOrganizations] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [aboutContent, setAboutContent] = useState({
    intro: '',
    mission: '',
    whatWeDo: '',
    volunteerExperience: ''
  });
  const [heroContent, setHeroContent] = useState({
    title: 'We Love Those You Love.',
    background_image: '/hero.png',
    background_video: null,
    use_video: false
  });
  const [introVideo, setIntroVideo] = useState({
    video_url: null,
    is_active: false
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedOrgForImage, setSelectedOrgForImage] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  const [orgForm, setOrgForm] = useState({
    name: '',
    description: '',
    profileImage: '',
    partnerSince: new Date().getFullYear().toString(),
    linkName: '',
    linkUrl: ''
  });
  const [lightboxImage, setLightboxImage] = useState(null);
  const [selectedOrgForGallery, setSelectedOrgForGallery] = useState(null);

  const [imageForm, setImageForm] = useState({
    images: [], // Changed to support multiple images
    description: '',
    year: new Date().getFullYear().toString()
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    image: '',
    bio: ''
  });

  const [opportunityForm, setOpportunityForm] = useState({
    title: '',
    brief: '',
    details: '',
    image: '',
    location: '',
    duration: '',
    requirements: ''
  });

  const [draggedOrgIndex, setDraggedOrgIndex] = useState(null);
  const [draggedTeamIndex, setDraggedTeamIndex] = useState(null);
  const [draggedOpportunityIndex, setDraggedOpportunityIndex] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [editingImageOrg, setEditingImageOrg] = useState(null);
  const [showEditImageModal, setShowEditImageModal] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/admin');
    }
    loadOrganizations();
    loadTeamMembers();
    loadContactMessages();
    loadAboutContent();
    loadOpportunities();
    loadHeroContent();
    loadIntroVideo();
  }, [navigate]);

  const loadOrganizations = async () => {
    const orgs = await organizationService.getAllOrganizations({ onUpdate: setOrganizations });
    setOrganizations(orgs);
  };

  const loadTeamMembers = async () => {
    const team = await teamService.getAllMembers();
    setTeamMembers(team);
  };

  const loadContactMessages = async () => {
    const messages = await messageService.getAllMessages();
    setContactMessages(messages);
  };

  const loadAboutContent = async () => {
    const content = await aboutService.getAboutContent();
    setAboutContent({
      intro: content.intro || "It's hard to believe people or know if your donation and help is getting into the right hands. This is where UniBridge comes in.",
      mission: content.mission || 'UniBridge Foundation is a non-profit organization focused on finding opportunities for organizations and people who need them most. We serve as a bridge between those who want to help and those who need support.',
      whatWeDo: content.what_we_do || 'We find, verify, and channel help to the right people and organizations. Our rigorous vetting process ensures that every donation, every resource, and every bit of support reaches verified recipients who truly need it.',
      volunteerExperience: content.volunteer_experience || 'While on the mission of helping, volunteers who join us will also experience safari trips during their service. We believe in creating meaningful connections not just with the communities we serve, but also with the beautiful environments we work in.'
    });
  };

  const loadOpportunities = async () => {
    const saved = await opportunityService.getAllOpportunities({ onUpdate: setOpportunities });
    setOpportunities(saved);
  };

  const loadHeroContent = async () => {
    const content = await heroService.getHeroContent();
    setHeroContent(content);
  };

  const loadIntroVideo = async () => {
    const video = await introVideoService.getIntroVideo();
    setIntroVideo(video);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin');
  };

  const handleOrgFormChange = (e) => {
    setOrgForm({
      ...orgForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = imageUtils.validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64 = await imageUtils.fileToBase64(file);
      setOrgForm({ ...orgForm, profileImage: base64 });
    } catch (error) {
      alert('Error uploading image');
    }
  };

  const handleSaveOrganization = async () => {
    if (!orgForm.name || !orgForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingOrg) {
        await organizationService.updateOrganization(editingOrg.id, orgForm);
      } else {
        await organizationService.addOrganization({ ...orgForm, gallery: [] });
      }
    } catch (e) {
      const msg = e && e.message ? e.message : 'Unknown error';
      alert('Failed to save organization: ' + msg + '\nIf using an older DB schema, run the latest SQL or drop link fields.');
      return;
    }

    setOrgForm({ name: '', description: '', profileImage: '', partnerSince: new Date().getFullYear().toString(), linkName: '', linkUrl: '' });
    setShowAddModal(false);
    setEditingOrg(null);
    loadOrganizations();
  };

  const handleEditOrganization = (org) => {
    setEditingOrg(org);
    setOrgForm({
      name: org.name,
      description: org.description,
      profileImage: org.profileImage || '',
      partnerSince: org.partnerSince || new Date().getFullYear().toString(),
      linkName: org.linkName || '',
      linkUrl: org.linkUrl || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteOrganization = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      await organizationService.deleteOrganization(id);
      loadOrganizations();
    }
  };

  // Drag and drop handlers for organizations
  const handleOrgDragStart = (index) => {
    setDraggedOrgIndex(index);
  };

  const handleOrgDragOver = (e, index) => {
    e.preventDefault();
    if (draggedOrgIndex === null || draggedOrgIndex === index) return;

    const newOrganizations = [...organizations];
    const draggedItem = newOrganizations[draggedOrgIndex];
    newOrganizations.splice(draggedOrgIndex, 1);
    newOrganizations.splice(index, 0, draggedItem);

    setOrganizations(newOrganizations);
    setDraggedOrgIndex(index);
  };

  const handleOrgDragEnd = async () => {
    if (draggedOrgIndex !== null) {
      await organizationService.updateDisplayOrder(organizations);
      setDraggedOrgIndex(null);
    }
  };

  // Drag and drop handlers for team members
  const handleTeamDragStart = (index) => {
    setDraggedTeamIndex(index);
  };

  const handleTeamDragOver = (e, index) => {
    e.preventDefault();
    if (draggedTeamIndex === null || draggedTeamIndex === index) return;

    const newTeamMembers = [...teamMembers];
    const draggedItem = newTeamMembers[draggedTeamIndex];
    newTeamMembers.splice(draggedTeamIndex, 1);
    newTeamMembers.splice(index, 0, draggedItem);

    setTeamMembers(newTeamMembers);
    setDraggedTeamIndex(index);
  };

  const handleTeamDragEnd = async () => {
    if (draggedTeamIndex !== null) {
      await teamService.updateDisplayOrder(teamMembers);
      setDraggedTeamIndex(null);
    }
  };

  // Drag and drop handlers for opportunities
  const handleOpportunityDragStart = (index) => {
    setDraggedOpportunityIndex(index);
  };

  const handleOpportunityDragOver = (e, index) => {
    e.preventDefault();
    if (draggedOpportunityIndex === null || draggedOpportunityIndex === index) return;

    const newOpportunities = [...opportunities];
    const draggedItem = newOpportunities[draggedOpportunityIndex];
    newOpportunities.splice(draggedOpportunityIndex, 1);
    newOpportunities.splice(index, 0, draggedItem);

    setOpportunities(newOpportunities);
    setDraggedOpportunityIndex(index);
  };

  const handleOpportunityDragEnd = async () => {
    if (draggedOpportunityIndex !== null) {
      await opportunityService.updateDisplayOrder(opportunities);
      setDraggedOpportunityIndex(null);
    }
  };

  const handleAddImage = (org) => {
    setSelectedOrgForImage(org);
    setImageForm({
      images: [],
      description: '',
      year: new Date().getFullYear().toString()
    });
    setShowImageModal(true);
  };

  const handleImageFormChange = (e) => {
    setImageForm({
      ...imageForm,
      [e.target.name]: e.target.value
    });
  };

  const handleGalleryImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validatedImages = [];

    for (const file of files) {
      const validation = imageUtils.validateImageFile(file);
      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        continue;
      }

      try {
        const upload = await imageUtils.uploadImage(file, 'organization-images');
        if (!upload.success) {
          alert(`${file.name}: ${upload.error}`);
          continue;
        }
        validatedImages.push({
          url: upload.url,
          path: upload.path,
          name: file.name
        });
      } catch (error) {
        alert(`Error uploading ${file.name}`);
      }
    }

    setImageForm({ ...imageForm, images: validatedImages });
  };

  const handleSaveImage = async () => {
    if (imageForm.images.length === 0 || !imageForm.year) {
      alert('Please upload at least one image and specify a year');
      return;
    }

    // Add all images to the gallery
    for (const image of imageForm.images) {
      await organizationService.addImageToOrganization(selectedOrgForImage.id, {
        url: image.url,
        path: image.path,
        description: imageForm.description,
        year: imageForm.year
      });
    }
    
    setShowImageModal(false);
    setSelectedOrgForImage(null);
    setImageForm({ images: [], description: '', year: new Date().getFullYear().toString() });
    loadOrganizations();
  };

  const handleDeleteImage = async (orgId, imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await organizationService.removeImageFromOrganization(orgId, imageId);
      loadOrganizations();
    }
  };

  const handleEditImage = (org, image) => {
    setEditingImageOrg(org);
    setEditingImage({
      id: image.id,
      description: image.description || '',
      year: image.year || new Date().getFullYear().toString()
    });
    setShowEditImageModal(true);
  };

  const handleSaveEditedImage = async () => {
    if (!editingImage.year) {
      alert('Please specify a year');
      return;
    }

    try {
      // Get fresh data
      const org = await organizationService.getOrganizationById(editingImageOrg.id);
      if (!org || !org.gallery) return;

      // Update only the specific image in the gallery
      const updatedGallery = org.gallery.map(img => 
        img.id === editingImage.id 
          ? { ...img, description: editingImage.description, year: editingImage.year }
          : img
      );

      // Use the update function
      await organizationService.updateOrganization(editingImageOrg.id, { gallery: updatedGallery });
      
      setShowEditImageModal(false);
      setEditingImage(null);
      setEditingImageOrg(null);
      
      // Reload to get fresh data
      await loadOrganizations();
      
      // Refresh gallery view if still open
      if (selectedOrgForGallery && selectedOrgForGallery.id === editingImageOrg.id) {
        const refreshedOrg = await organizationService.getOrganizationById(editingImageOrg.id);
        setSelectedOrgForGallery(refreshedOrg);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image changes. Please try again.');
    }
  };

  // Team Management Functions
  const handleTeamFormChange = (e) => {
    setTeamForm({
      ...teamForm,
      [e.target.name]: e.target.value
    });
  };

  const handleTeamImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = imageUtils.validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64 = await imageUtils.fileToBase64(file);
      setTeamForm({ ...teamForm, image: base64 });
    } catch (error) {
      alert('Error uploading image');
    }
  };

  const handleSaveTeamMember = async () => {
    if (!teamForm.name || !teamForm.role) {
      alert('Please fill in name and role');
      return;
    }

    try {
      if (editingMember) {
        await teamService.updateMember(editingMember.id, teamForm);
      } else {
        await teamService.addMember(teamForm);
      }
      
      setShowTeamModal(false);
      setEditingMember(null);
      setTeamForm({ name: '', role: '', image: '', bio: '' });
      loadTeamMembers();
    } catch (error) {
      alert('Failed to save team member');
    }
  };

  const handleEditTeamMember = (member) => {
    setEditingMember(member);
    setTeamForm({
      name: member.name,
      role: member.role,
      image: member.image || '',
      bio: member.bio || ''
    });
    setShowTeamModal(true);
  };

  const handleDeleteTeamMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      await teamService.deleteMember(id);
      loadTeamMembers();
    }
  };

  const handleAboutContentChange = (field, value) => {
    setAboutContent({ ...aboutContent, [field]: value });
  };

  const handleSaveAboutContent = async () => {
    const result = await aboutService.updateAboutContent({
      intro: aboutContent.intro,
      mission: aboutContent.mission,
      what_we_do: aboutContent.whatWeDo,
      volunteer_experience: aboutContent.volunteerExperience
    });
    
    if (result) {
      alert('About content updated successfully!');
    } else {
      alert('Failed to update about content');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await messageService.deleteMessage(id);
      loadContactMessages();
    }
  };

  const handleMarkMessageRead = async (id) => {
    const message = contactMessages.find(m => m.id === id);
    if (message) {
      await messageService.updateMessage(id, { status: message.status === 'read' ? 'unread' : 'read' });
      loadContactMessages();
    }
  };

  // Opportunity handlers
  const handleOpportunityFormChange = (e) => {
    setOpportunityForm({
      ...opportunityForm,
      [e.target.name]: e.target.value
    });
  };

  const handleOpportunityImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = imageUtils.validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64 = await imageUtils.fileToBase64(file);
      setOpportunityForm({ ...opportunityForm, image: base64 });
    } catch (error) {
      alert('Error uploading image');
    }
  };

  const handleSaveOpportunity = async () => {
    if (!opportunityForm.title || !opportunityForm.brief || !opportunityForm.details) {
      alert('Please fill in title, brief description, and details');
      return;
    }

    try {
      if (editingOpportunity) {
        await opportunityService.updateOpportunity(editingOpportunity.id, opportunityForm);
      } else {
        await opportunityService.addOpportunity(opportunityForm);
      }

      setOpportunityForm({
        title: '',
        brief: '',
        details: '',
        image: '',
        location: '',
        duration: '',
        requirements: ''
      });
      setShowOpportunityModal(false);
      setEditingOpportunity(null);
      loadOpportunities();
    } catch (error) {
      alert('Failed to save opportunity');
    }
  };

  const handleEditOpportunity = (opportunity) => {
    setEditingOpportunity(opportunity);
    setOpportunityForm({
      title: opportunity.title,
      brief: opportunity.brief,
      details: opportunity.details,
      image: opportunity.image || '',
      location: opportunity.location || '',
      duration: opportunity.duration || '',
      requirements: opportunity.requirements || ''
    });
    setShowOpportunityModal(true);
  };

  const handleDeleteOpportunity = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      await opportunityService.deleteOpportunity(id);
      loadOpportunities();
    }
  };

  // Hero content handlers
  const handleHeroImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = imageUtils.validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64 = await imageUtils.fileToBase64(file);
      setHeroContent({ ...heroContent, background_image: base64, use_video: false });
    } catch (error) {
      alert('Error uploading image');
    }
  };

  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, or OGG)');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('Video size should be less than 50MB');
      return;
    }

    try {
      const base64 = await imageUtils.fileToBase64(file);
      setHeroContent({ ...heroContent, background_video: base64, use_video: true });
    } catch (error) {
      alert('Error uploading video');
    }
  };

  const handleSaveHeroContent = async () => {
    const result = await heroService.updateHeroContent(heroContent);
    
    if (result) {
      alert('Hero content updated successfully!');
    } else {
      alert('Failed to update hero content');
    }
  };

  const handleDeleteHeroVideo = async () => {
    if (window.confirm('Are you sure you want to delete the video?')) {
      setHeroContent({ ...heroContent, background_video: null, use_video: false });
    }
  };

  // Intro video handlers
  const handleIntroVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video file (MP4, WebM, or OGG)');
      return;
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      alert('Video size should be less than 50MB');
      return;
    }

    try {
      const upload = await imageUtils.uploadVideo(file, 'hero-media');
      if (!upload.success) {
        alert(upload.error || 'Failed to upload video');
        return;
      }
      setIntroVideo({ ...introVideo, video_url: upload.url, is_active: true });
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Error uploading video');
    }
  };

  const handleSaveIntroVideo = async () => {
    const payload = {
      video_url: introVideo.video_url,
      is_active: Boolean(introVideo.video_url)
    };

    const result = await introVideoService.updateIntroVideo(payload);
    setIntroVideo(payload);
    
    if (result) {
      alert('Intro video updated successfully!');
    } else {
      alert('Failed to update intro video');
    }
  };

  const handleDeleteIntroVideo = async () => {
    if (window.confirm('Are you sure you want to delete the intro video?')) {
      const payload = { video_url: null, is_active: false };
      const result = await introVideoService.updateIntroVideo(payload);
      setIntroVideo(payload);
      if (result) {
        alert('Intro video deleted. The section is now hidden on the homepage.');
      } else {
        alert('Failed to delete intro video');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img src="/logo.png" alt="UniBridge Logo" className="h-8 sm:h-10 w-auto" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-unibridge-navy">Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-600">Manage Content</p>
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            <a
              href="/"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-unibridge-blue hover:text-unibridge-navy transition-colors font-medium"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'organizations'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Organizations
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'team'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'opportunities'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'content'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'hero'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hero
          </button>
          <button
            onClick={() => setActiveTab('intro-video')}
            className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'intro-video'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Video
          </button>
        </div>

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy">Organizations</h2>
                <p className="text-sm text-gray-500 mt-1">Drag and drop to reorder</p>
              </div>
              <button
                onClick={() => {
                  setEditingOrg(null);
                  setOrgForm({ name: '', description: '', profileImage: '', partnerSince: new Date().getFullYear().toString(), linkName: '', linkUrl: '' });
                  setShowAddModal(true);
                }}
                className="w-full sm:w-auto bg-unibridge-blue text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-unibridge-navy transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Organization
              </button>
            </div>

            {/* Organizations List */}
            {organizations.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">No organizations yet. Add your first organization!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {organizations.map((org, index) => (
                  <div 
                    key={org.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-move hover:shadow-lg transition-shadow"
                    draggable
                    onDragStart={() => handleOrgDragStart(index)}
                    onDragOver={(e) => handleOrgDragOver(e, index)}
                    onDragEnd={handleOrgDragEnd}
                  >
                    <div className="md:flex">
                      <div className="md:w-48 h-48 pointer-events-none">
                        {org.profileImage ? (
                          <img src={org.profileImage} alt={org.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-unibridge-blue to-blue-600 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">{org.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-unibridge-navy mb-2">{org.name}</h3>
                            <p className="text-gray-600 line-clamp-2">{org.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditOrganization(org)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteOrganization(org.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-700">
                              Gallery ({org.gallery?.length || 0} images)
                            </h4>
                            <button
                              onClick={() => handleAddImage(org)}
                              className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Add Image
                            </button>
                          </div>

                          {org.gallery && org.gallery.length > 0 && (
                            <div className="space-y-2">
                              <button
                                onClick={() => { setSelectedOrgForGallery(org); }}
                                className="text-sm text-unibridge-blue font-medium"
                              >
                                View & Manage All {org.gallery.length} Images →
                              </button>
                              <div className="grid grid-cols-4 gap-2">
                                {org.gallery.slice(0, 4).map(image => (
                                  <div key={image.id} className="relative group">
                                    <img
                                      src={image.url}
                                      alt={image.description}
                                      onClick={() => setLightboxImage(image.url)}
                                      className="w-full h-20 object-cover rounded cursor-pointer"
                                    />
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDeleteImage(org.id, image.id); }}
                                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                    <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                      {image.year}
                                    </div>
                                  </div>
                                ))}
                                {org.gallery.length > 4 && (
                                  <div className="w-full h-20 bg-gray-200 rounded flex items-center justify-center text-gray-600 text-sm">
                                    +{org.gallery.length - 4} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Team Members Tab */}
        {activeTab === 'team' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy">Team Members</h2>
                <p className="text-sm text-gray-500 mt-1">Drag and drop to reorder</p>
              </div>
              <button
                onClick={() => {
                  setEditingMember(null);
                  setTeamForm({ name: '', role: '', image: '', bio: '' });
                  setShowTeamModal(true);
                }}
                className="w-full sm:w-auto bg-unibridge-blue text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-unibridge-navy transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Team Member
              </button>
            </div>

            {teamMembers.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">No team members yet. Add your first team member!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <div 
                    key={member.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-move hover:shadow-lg transition-shadow"
                    draggable
                    onDragStart={() => handleTeamDragStart(index)}
                    onDragOver={(e) => handleTeamDragOver(e, index)}
                    onDragEnd={handleTeamDragEnd}
                  >
                    <div className="flex items-center p-6">
                      <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <div className="flex-shrink-0 mr-6 pointer-events-none">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-unibridge-blue to-blue-600 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">{member.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-unibridge-navy mb-1">{member.name}</h3>
                        <p className="text-unibridge-blue font-semibold mb-2">{member.role}</p>
                        {member.bio && (
                          <p className="text-gray-600 text-sm line-clamp-2">{member.bio}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleEditTeamMember(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteTeamMember(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy">Volunteering Opportunities</h2>
              <button
                onClick={() => {
                  setEditingOpportunity(null);
                  setOpportunityForm({
                    title: '',
                    brief: '',
                    details: '',
                    image: '',
                    location: '',
                    duration: '',
                    requirements: ''
                  });
                  setShowOpportunityModal(true);
                }}
                className="w-full sm:w-auto bg-unibridge-blue text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-unibridge-navy transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Opportunity
              </button>
            </div>

            {opportunities.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">No opportunities yet. Add your first opportunity!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {opportunities.map((opp, index) => (
                  <div
                    key={opp.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-move"
                    draggable
                    onDragStart={() => handleOpportunityDragStart(index)}
                    onDragOver={(e) => handleOpportunityDragOver(e, index)}
                    onDragEnd={handleOpportunityDragEnd}
                  >
                    <div className="flex">
                      <div className="w-48 flex-shrink-0">
                        {opp.image ? (
                          <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-unibridge-blue to-blue-600 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">{opp.title.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-unibridge-navy">{opp.title}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditOpportunity(opp)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteOpportunity(opp.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{opp.brief}</p>
                        {opp.location && (
                          <p className="text-xs text-gray-500">
                            <strong>Location:</strong> {opp.location}
                          </p>
                        )}
                        {opp.duration && (
                          <p className="text-xs text-gray-500">
                            <strong>Duration:</strong> {opp.duration}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Content & Messages Tab */}
        {activeTab === 'content' && (
          <>
            <div className="space-y-8">
              {/* About Content Section */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy">About Page Content</h2>
                  <button
                    onClick={handleSaveAboutContent}
                    className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Introduction Text
                    </label>
                    <textarea
                      value={aboutContent.intro}
                      onChange={(e) => handleAboutContentChange('intro', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                      placeholder="Enter introduction text..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Our Mission
                    </label>
                    <textarea
                      value={aboutContent.mission}
                      onChange={(e) => handleAboutContentChange('mission', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                      placeholder="Enter mission statement..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      What We Do
                    </label>
                    <textarea
                      value={aboutContent.whatWeDo}
                      onChange={(e) => handleAboutContentChange('whatWeDo', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                      placeholder="Enter what we do description..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Volunteer Experience
                    </label>
                    <textarea
                      value={aboutContent.volunteerExperience}
                      onChange={(e) => handleAboutContentChange('volunteerExperience', e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                      placeholder="Enter volunteer experience description..."
                    />
                  </div>
                </div>
              </div>

              {/* Contact Messages Section */}
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy mb-6">Contact Messages</h2>
                
                {contactMessages.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-lg">No messages yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contactMessages.sort((a, b) => b.timestamp - a.timestamp).map(message => (
                      <div 
                        key={message.id} 
                        className={`border rounded-lg p-6 transition-colors ${
                          message.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-unibridge-navy">{message.name}</h3>
                              {!message.read && (
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                  NEW
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Email:</strong> {message.email}
                            </p>
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Subject:</strong> {message.subject}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleMarkMessageRead(message.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                message.read 
                                  ? 'text-gray-600 hover:bg-gray-200' 
                                  : 'text-blue-600 hover:bg-blue-100'
                              }`}
                              title={message.read ? 'Mark as unread' : 'Mark as read'}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded border border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Organization Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-2xl max-w-2xl w-full min-h-screen sm:min-h-0 sm:max-h-[90vh] sm:my-8 overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-unibridge-navy">
                {editingOrg ? 'Edit Organization' : 'Add New Organization'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={orgForm.name}
                  onChange={handleOrgFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={orgForm.description}
                  onChange={handleOrgFormChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none resize-none"
                  placeholder="Enter organization description"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                />
                {orgForm.profileImage && (
                  <img src={orgForm.profileImage} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Since (Year)
                </label>
                <input
                  type="text"
                  name="partnerSince"
                  value={orgForm.partnerSince}
                  onChange={handleOrgFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="e.g., 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Name (Optional)
                </label>
                <input
                  type="text"
                  name="linkName"
                  value={orgForm.linkName}
                  onChange={handleOrgFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="e.g., Visit Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  name="linkUrl"
                  value={orgForm.linkUrl}
                  onChange={handleOrgFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingOrg(null);
                  setOrgForm({ name: '', description: '', profileImage: '', partnerSince: new Date().getFullYear().toString(), linkName: '', linkUrl: '' });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrganization}
                className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors"
              >
                {editingOrg ? 'Update' : 'Add'} Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-2xl max-w-2xl w-full min-h-screen sm:min-h-0 sm:my-8 max-h-screen sm:max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-unibridge-navy">
                Add Image to {selectedOrgForImage?.name}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images * (Select multiple images)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                />
                {imageForm.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {imageForm.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img.url} alt={`Preview ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={() => {
                            const newImages = imageForm.images.filter((_, i) => i !== idx);
                            setImageForm({ ...imageForm, images: newImages });
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">{imageForm.images.length} image(s) selected</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year * (applies to all images)
                </label>
                <input
                  type="text"
                  name="year"
                  value={imageForm.year}
                  onChange={handleImageFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="e.g., 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (applies to all images)
                </label>
                <textarea
                  name="description"
                  value={imageForm.description}
                  onChange={handleImageFormChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none resize-none"
                  placeholder="Enter image description"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedOrgForImage(null);
                  setImageForm({ images: [], description: '', year: new Date().getFullYear().toString() });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveImage}
                className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors"
              >
                Add {imageForm.images.length} Image{imageForm.images.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Team Member Modal */}
      {showTeamModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-2xl max-w-2xl w-full min-h-screen sm:min-h-0 sm:max-h-[90vh] sm:my-8 overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-unibridge-navy">
                {editingMember ? 'Edit Team Member' : 'Add Team Member'}
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={teamForm.name}
                  onChange={handleTeamFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <input
                  type="text"
                  name="role"
                  value={teamForm.role}
                  onChange={handleTeamFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="e.g., Founder & CEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleTeamImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                />
                {teamForm.image && (
                  <img src={teamForm.image} alt="Preview" className="mt-4 w-32 h-32 rounded-full object-cover" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={teamForm.bio}
                  onChange={handleTeamFormChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none resize-none"
                  placeholder="Brief bio about this team member"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowTeamModal(false);
                  setEditingMember(null);
                  setTeamForm({ name: '', role: '', image: '', bio: '' });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTeamMember}
                className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors"
              >
                {editingMember ? 'Update' : 'Add'} Team Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Opportunity Modal */}
      {showOpportunityModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-2xl max-w-3xl w-full min-h-screen sm:min-h-0 sm:max-h-[90vh] sm:my-8 overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-unibridge-navy">
                {editingOpportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={opportunityForm.title}
                  onChange={handleOpportunityFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                  placeholder="e.g., Medical Volunteer Needed"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Brief Description * (shown on home page)
                </label>
                <textarea
                  name="brief"
                  value={opportunityForm.brief}
                  onChange={handleOpportunityFormChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                  placeholder="Short description for the home page..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  name="details"
                  value={opportunityForm.details}
                  onChange={handleOpportunityFormChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                  placeholder="Full description shown on detail page..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={opportunityForm.location}
                  onChange={handleOpportunityFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                  placeholder="e.g., Kenya, Nairobi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={opportunityForm.duration}
                  onChange={handleOpportunityFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                  placeholder="e.g., 2 weeks, 3 months"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={opportunityForm.requirements}
                  onChange={handleOpportunityFormChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                  placeholder="List any requirements or qualifications..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleOpportunityImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-unibridge-blue"
                />
                {opportunityForm.image && (
                  <div className="mt-4">
                    <img
                      src={opportunityForm.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowOpportunityModal(false);
                  setEditingOpportunity(null);
                  setOpportunityForm({
                    title: '',
                    brief: '',
                    details: '',
                    image: '',
                    location: '',
                    duration: '',
                    requirements: ''
                  });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOpportunity}
                className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors"
              >
                {editingOpportunity ? 'Update' : 'Add'} Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section Tab */}
      {activeTab === 'hero' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy mb-6 sm:mb-8">Hero Section</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
              <input
                type="text"
                value={heroContent.title || ''}
                onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent"
                placeholder="We Love Those You Love."
              />
            </div>

            {/* Background Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!heroContent.use_video}
                    onChange={() => setHeroContent({ ...heroContent, use_video: false })}
                    className="mr-2"
                  />
                  Image
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={heroContent.use_video}
                    onChange={() => setHeroContent({ ...heroContent, use_video: true })}
                    className="mr-2"
                  />
                  Video
                </label>
              </div>
            </div>

            {/* Image Upload */}
            {!heroContent.use_video && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                {heroContent.background_image && (
                  <div className="mb-4">
                    <img 
                      src={heroContent.background_image} 
                      alt="Hero background" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">Recommended size: 1920x600px</p>
              </div>
            )}

            {/* Video Upload */}
            {heroContent.use_video && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Video</label>
                {heroContent.background_video && (
                  <div className="mb-4 relative">
                    <video 
                      src={heroContent.background_video} 
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                    <button
                      onClick={handleDeleteHeroVideo}
                      className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete Video
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleHeroVideoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">Max size: 50MB. Formats: MP4, WebM, OGG</p>
              </div>
            )}

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
              <div className="relative h-64 rounded-lg overflow-hidden">
                {heroContent.use_video && heroContent.background_video ? (
                  <video 
                    src={heroContent.background_video}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src={heroContent.background_image || '/hero.png'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-unibridge-navy/80 to-unibridge-blue/60 flex items-center justify-center">
                  <h1 className="text-4xl font-bold text-white text-center px-4">
                    {heroContent.title || 'We Love Those You Love.'}
                  </h1>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveHeroContent}
                className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors"
              >
                Save Hero Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intro Video Tab */}
      {activeTab === 'intro-video' && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-unibridge-navy mb-6 sm:mb-8">Intro Video</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Upload a single intro video (MP4, WebM, or OGG). The file is stored in Supabase Storage (hero-media bucket). When
                uploaded and saved, it will autoplay on the homepage. If you delete it, the homepage section disappears automatically.
              </p>

              {introVideo.video_url ? (
                <div className="relative">
                  <video
                    src={introVideo.video_url}
                    className="w-full h-64 object-cover rounded-lg"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <button
                    onClick={handleDeleteIntroVideo}
                    className="absolute top-3 right-3 px-3 py-1.5 bg-red-600 text-white text-sm rounded shadow hover:bg-red-700"
                  >
                    Delete video
                  </button>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                  No intro video uploaded yet.
                </div>
              )}

              <div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleIntroVideoUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-1">Max size: 50MB. Formats: MP4, WebM, OGG.</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveIntroVideo}
                  className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors disabled:opacity-60"
                  disabled={!introVideo.video_url}
                >
                  Save intro video
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
          >
            &times;
          </button>
          <img 
            src={lightboxImage} 
            alt="Full size" 
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Gallery Manager Modal */}
      {selectedOrgForGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-2xl max-w-4xl w-full min-h-screen sm:min-h-0 sm:my-8 overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-unibridge-navy">
                  Manage Gallery - {selectedOrgForGallery.name}
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      handleAddImage(selectedOrgForGallery);
                      setSelectedOrgForGallery(null);
                    }}
                    className="px-4 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add More Images
                  </button>
                  <button
                    onClick={() => setSelectedOrgForGallery(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {selectedOrgForGallery.gallery && selectedOrgForGallery.gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedOrgForGallery.gallery.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt={image.description || `Image ${index + 1}`}
                        onClick={() => setLightboxImage(image.url)}
                        className="w-full h-32 object-cover rounded cursor-pointer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2">
                        <button
                          onClick={() => setLightboxImage(image.url)}
                          className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditImage(selectedOrgForGallery, image); }}
                          className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteImage(selectedOrgForGallery.id, image.id); }}
                          className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 text-center">
                        {image.year || 'No year'} • {image.description || 'No description'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-12">No images in gallery yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Image Modal */}
      {showEditImageModal && editingImage && (
        <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center p-0 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-none sm:rounded-2xl max-w-2xl w-full min-h-screen sm:min-h-0 sm:my-8 max-h-screen sm:max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-2xl font-bold text-unibridge-navy">
                Edit Image Details
              </h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="text"
                  value={editingImage.year}
                  onChange={(e) => setEditingImage({ ...editingImage, year: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none"
                  placeholder="e.g., 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingImage.description}
                  onChange={(e) => setEditingImage({ ...editingImage, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent outline-none resize-none"
                  placeholder="Enter image description"
                ></textarea>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowEditImageModal(false);
                  setEditingImage(null);
                  setEditingImageOrg(null);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedImage}
                className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
