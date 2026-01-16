import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { organizationService } from '../utils/storage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrganizationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organization, setOrganization] = useState(null);
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxAlt, setLightboxAlt] = useState('');
  const [lightboxDescription, setLightboxDescription] = useState('');

  useEffect(() => {
    const fetchOrganization = async () => {
      const org = await organizationService.getOrganizationById(id);
      if (!org) {
        navigate('/');
        return;
      }
      setOrganization(org);
      setLoading(false);
    };
    fetchOrganization();
  }, [id, navigate]);

  useEffect(() => {
    if (!lightboxImage) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!organization) {
    return null;
  }

  // Get unique years from gallery
  const years = organization.gallery 
    ? [...new Set(organization.gallery.map(img => img.year))].sort((a, b) => b - a)
    : [];

  // Filter images by selected year
  const filteredGallery = organization.gallery
    ? selectedYear === 'all'
      ? organization.gallery
      : organization.gallery.filter(img => img.year === selectedYear)
    : [];

  // Group images by year for display
  const groupedByYear = {};
  if (organization.gallery) {
    organization.gallery.forEach(img => {
      if (!groupedByYear[img.year]) {
        groupedByYear[img.year] = [];
      }
      groupedByYear[img.year].push(img);
    });
  }

  const openLightbox = (image) => {
    setLightboxImage(image.url);
    setLightboxAlt(image.description || 'Gallery image');
    setLightboxDescription(image.description || '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link 
            to="/"
            className="inline-flex items-center text-unibridge-blue hover:text-unibridge-navy mb-8 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          {/* Organization header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/3">
                {organization.profileImage ? (
                  <img
                    src={organization.profileImage}
                    alt={organization.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                    <span className="text-white text-6xl font-bold">
                      {organization.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="md:w-2/3 p-8 md:p-12">
                <h1 className="text-4xl md:text-5xl font-bold text-unibridge-navy mb-6">
                  {organization.name}
                </h1>
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {organization.description}
                </p>
                {organization.partnerSince && (
                  <p className="text-sm text-gray-500 mt-6">
                    Partner since {organization.partnerSince}
                  </p>
                )}
                {organization.linkUrl && organization.linkName && (
                  <a
                    href={organization.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-6 py-3 bg-unibridge-blue text-white font-semibold rounded-lg hover:bg-unibridge-navy transition-colors shadow-md hover:shadow-lg"
                  >
                    {organization.linkName}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Gallery section */}
          {organization.gallery && organization.gallery.length > 0 ? (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-unibridge-navy">
                  Gallery
                </h2>
                
                {/* Year filter */}
                {years.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setSelectedYear('all')}
                      className={`px-4 py-2 rounded-full font-medium transition-colors ${
                        selectedYear === 'all'
                          ? 'bg-unibridge-blue text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      All Years
                    </button>
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${
                          selectedYear === year
                            ? 'bg-unibridge-blue text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery organized by year */}
              {selectedYear === 'all' ? (
                <div className="space-y-12">
                  {Object.keys(groupedByYear).sort((a, b) => b - a).map(year => (
                    <div key={year}>
                      <h3 className="text-2xl font-bold text-unibridge-navy mb-6 border-b-2 border-unibridge-blue pb-2">
                        {year}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {groupedByYear[year].map(image => (
                          <div 
                            key={image.id}
                            className="relative bg-white rounded-xl shadow-lg overflow-hidden"
                          >
                            <div className="relative h-64 overflow-hidden bg-gray-200">
                              <img
                                src={image.url}
                                alt={image.description || 'Gallery image'}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => openLightbox(image)}
                              />
                            </div>
                            {image.description && (
                              <div className="p-4">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  {image.description}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGallery.map(image => (
                    <div 
                      key={image.id}
                      className="relative bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="relative h-64 overflow-hidden bg-gray-200">
                        <img
                          src={image.url}
                          alt={image.description || 'Gallery image'}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => openLightbox(image)}
                        />
                      </div>
                      {image.description && (
                        <div className="p-4">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {image.description}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg">No gallery images yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
            aria-label="Close image preview"
          >
            &times;
          </button>
          <div
            className="max-w-[95vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt={lightboxAlt}
              className="max-w-full max-h-[80vh] object-contain"
            />
            {lightboxDescription && (
              <div className="mt-4">
                <p className="text-white text-sm leading-relaxed">
                  {lightboxDescription}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrganizationDetail;
