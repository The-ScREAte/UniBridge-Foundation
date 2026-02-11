import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizationService } from '../utils/storage';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    organizationService.getAllOrganizations({ onUpdate: (data) => mounted && setOrganizations(data) })
      .then((data) => {
        if (mounted) {
          setOrganizations(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load organizations:', error);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section id="organizations" className="bg-gray-50 px-2 py-8 sm:px-4 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-unibridge-navy mb-4">Our Partner Organizations</h2>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                <div className="bg-gray-200 aspect-[16/10]"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (organizations.length === 0) {
    return (
      <section id="organizations" className="bg-gray-50 px-2 py-8 sm:px-4 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-unibridge-navy mb-4">Our Partner Organizations</h2>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Verified partners we trust and work with. Once partners are added, they’ll appear here.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-100 p-10 text-center">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-unibridge-blue/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H2v-2a4 4 0 014-4h7m3-4a4 4 0 10-8 0 4 4 0 008 0zm6 4a3 3 0 10-6 0 3 3 0 006 0z" />
              </svg>
            </div>
            <h3 className="mt-5 text-xl font-bold text-unibridge-navy">No partners listed yet</h3>
            <p className="mt-2 text-gray-600">If you’re an organization, you can contact us to start the verification process.</p>
            <div className="mt-6">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-unibridge-blue text-white font-semibold hover:bg-unibridge-navy transition"
              >
                Start a partnership
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featured = organizations.slice(0, 6);

  return (
    <section id="organizations" className="bg-gray-50 px-2 py-8 sm:px-4 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-unibridge-navy">Our Partner Organizations</h2>
            <div className="mt-4 w-20 h-1 bg-unibridge-blue mx-auto md:mx-0"></div>
           
          </div>

          {/* Buttons moved to Home.jsx below Organizations section */}
        </div>

        {/* Mobile: swipeable two-row grid */}
        <div className="lg:hidden">
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(240px,1fr)] sm:auto-cols-[minmax(280px,1fr)] gap-4 overflow-x-auto pb-4 pr-4 snap-x snap-mandatory">
            {featured.map((org) => (
              <Link
                key={org.id}
                to={`/organization/${org.id}`}
                className="snap-start rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative overflow-hidden bg-gray-200 aspect-[4/3]">
                  {org.profileImage ? (
                    <img src={org.profileImage} alt={org.name} loading="lazy" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                      <span className="text-white text-4xl font-bold">{org.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  {org.partnerSince && (
                    <div className="absolute left-4 bottom-4">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-unibridge-navy">
                        Partner since {org.partnerSince}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-unibridge-navy line-clamp-1">{org.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">{org.description}</p>
                  <div className="mt-4 text-sm font-semibold text-unibridge-blue inline-flex items-center gap-2">
                    Explore
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: clean grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {featured.map((org) => (
            <Link
              key={org.id}
              to={`/organization/${org.id}`}
              className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative overflow-hidden bg-gray-200 aspect-[16/10]">
                {org.profileImage ? (
                  <img
                    src={org.profileImage}
                    alt={org.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                    <span className="text-white text-5xl font-bold">{org.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                {org.partnerSince && (
                  <div className="absolute left-4 bottom-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-unibridge-navy">
                      Partner since {org.partnerSince}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-unibridge-navy group-hover:text-unibridge-blue transition-colors">
                  {org.name}
                </h3>
                <p className="mt-3 text-gray-600 leading-relaxed line-clamp-3">{org.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-500">View profile</span>
                  <span className="inline-flex items-center gap-2 text-unibridge-blue font-semibold">
                    Explore
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {organizations.length > featured.length && (
          <div className="mt-10 text-center">
            <Link
              to="/organizations"
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-gray-200 bg-white text-unibridge-navy font-semibold hover:bg-gray-100 transition"
            >
              View all {organizations.length} organizations
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Organizations;
