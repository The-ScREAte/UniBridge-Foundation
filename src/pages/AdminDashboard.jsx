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
    video_url: '/unibridge-intro.mp4',
    poster_url: '/video-poster.jpg',
    title: 'UniBridge Introduction',
    description: '',
    is_active: true
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
    partnerSince: new Date().getFullYear().toString()
  });

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
    const orgs = await organizationService.getAllOrganizations();
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
    const saved = await opportunityService.getAllOpportunities();
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
      alert('Failed to save organization: ' + (e && e.message ? e.message : 'Unknown error'));
      return;
    }

    setOrgForm({ name: '', description: '', profileImage: '', partnerSince: new Date().getFullYear().toString() });
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
      partnerSince: org.partnerSince || new Date().getFullYear().toString()
    });
    setShowAddModal(true);
  };

  const handleDeleteOrganization = async (id) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      await organizationService.deleteOrganization(id);
      loadOrganizations();
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
        const base64 = await imageUtils.fileToBase64(file);
        validatedImages.push({
          url: base64,
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
      const base64 = await imageUtils.fileToBase64(file);
      setIntroVideo({ ...introVideo, video_url: base64 });
    } catch (error) {
      alert('Error uploading video');
    }
  };

  const handleIntroPosterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = imageUtils.validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64 = await imageUtils.fileToBase64(file);
      setIntroVideo({ ...introVideo, poster_url: base64 });
    } catch (error) {
      alert('Error uploading poster');
    }
  };

  const handleSaveIntroVideo = async () => {
    const result = await introVideoService.updateIntroVideo(introVideo);
    
    if (result) {
      alert('Intro video updated successfully!');
    } else {
      alert('Failed to update intro video');
    }
  };

  const handleDeleteIntroVideo = async () => {
    if (window.confirm('Are you sure you want to delete the intro video?')) {
      setIntroVideo({ ...introVideo, video_url: null, is_active: false });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="UniBridge Logo" className="h-10 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-unibridge-navy">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage Content</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="/"
              className="px-4 py-2 text-unibridge-blue hover:text-unibridge-navy transition-colors font-medium"
            >
              View Site
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('organizations')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'organizations'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Organizations
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'team'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team Members
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'opportunities'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'content'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Content & Messages
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'hero'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab('intro-video')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'intro-video'
                ? 'text-unibridge-blue border-b-2 border-unibridge-blue'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Intro Video
          </button>
        </div>

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-unibridge-navy">Organizations</h2>
              <button
                onClick={() => {
                  setEditingOrg(null);
                  setOrgForm({ name: '', description: '', profileImage: '', partnerSince: new Date().getFullYear().toString() });
                  setShowAddModal(true);
                }}
                className="bg-unibridge-blue text-white px-6 py-3 rounded-lg hover:bg-unibridge-navy transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {organizations.map(org => (
                  <div key={org.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-48 h-48">
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
                            <div className="grid grid-cols-4 gap-2">
                              {org.gallery.slice(0, 4).map(image => (
                                <div key={image.id} className="relative group">
                                  <img
                                    src={image.url}
                                    alt={image.description}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                  <button
                                    onClick={() => handleDeleteImage(org.id, image.id)}
                                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-unibridge-navy">Team Members</h2>
              <button
                onClick={() => {
                  setEditingMember(null);
                  setTeamForm({ name: '', role: '', image: '', bio: '' });
                  setShowTeamModal(true);
                }}
                className="bg-unibridge-blue text-white px-6 py-3 rounded-lg hover:bg-unibridge-navy transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="flex items-center p-6">
                      <div className="flex-shrink-0 mr-6">
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
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-unibridge-navy">Volunteering Opportunities</h2>
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
                className="bg-unibridge-blue text-white px-6 py-3 rounded-lg hover:bg-unibridge-navy transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {opportunities.map(opp => (
                  <div key={opp.id} className="bg-white rounded-xl shadow-md overflow-hidden">
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
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-unibridge-navy">About Page Content</h2>
                  <button
                    onClick={handleSaveAboutContent}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
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
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-3xl font-bold text-unibridge-navy mb-6">Contact Messages</h2>
                
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            </div>

            <div className="p-6 border-t flex justify-end gap-4 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingOrg(null);
                  setOrgForm({ name: '', description: '', profileImage: '', partnerSince: new Date().getFullYear().toString() });
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
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
          <h2 className="text-3xl font-bold text-unibridge-navy mb-8">Hero Section</h2>
          
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
          <h2 className="text-3xl font-bold text-unibridge-navy mb-8">Intro Video</h2>
          
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {/* Active Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Display Video on Homepage</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={introVideo.is_active}
                  onChange={(e) => setIntroVideo({ ...introVideo, is_active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-unibridge-blue"></div>
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title (Optional)</label>
              <input
                type="text"
                value={introVideo.title || ''}
                onChange={(e) => setIntroVideo({ ...introVideo, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent"
                placeholder="UniBridge Introduction"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={introVideo.description || ''}
                onChange={(e) => setIntroVideo({ ...introVideo, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-unibridge-blue focus:border-transparent"
                placeholder="Brief description about the video..."
              />
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Intro Video</label>
              {introVideo.video_url && (
                <div className="mb-4 relative">
                  <video 
                    src={introVideo.video_url}
                    poster={introVideo.poster_url}
                    className="w-full h-64 object-cover rounded-lg"
                    controls
                  />
                  <button
                    onClick={handleDeleteIntroVideo}
                    className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Delete Video
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleIntroVideoUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">Max size: 50MB. Formats: MP4, WebM, OGG</p>
            </div>

            {/* Poster Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video Poster/Thumbnail (Optional)</label>
              {introVideo.poster_url && (
                <div className="mb-4">
                  <img 
                    src={introVideo.poster_url}
                    alt="Video poster"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleIntroPosterUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-1">Displayed before video loads. Recommended: 1280x720px</p>
            </div>

            {/* Preview */}
            {introVideo.is_active && introVideo.video_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                <div className="bg-gray-50 p-8 rounded-lg">
                  {introVideo.title && (
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-unibridge-navy mb-2">{introVideo.title}</h3>
                      <div className="w-12 h-0.5 bg-unibridge-blue mx-auto"></div>
                    </div>
                  )}
                  <div className="rounded-lg overflow-hidden shadow-xl">
                    <video
                      src={introVideo.video_url}
                      poster={introVideo.poster_url}
                      className="w-full h-48 object-cover"
                      controls
                    />
                  </div>
                  {introVideo.description && (
                    <p className="text-center text-gray-600 mt-4">{introVideo.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveIntroVideo}
                className="px-6 py-2 bg-unibridge-blue text-white rounded-lg hover:bg-unibridge-navy transition-colors"
              >
                Save Intro Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
