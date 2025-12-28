import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizationService } from '../utils/storage';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await organizationService.getAllOrganizations();
      setOrganizations(orgs);
    };
    fetchOrganizations();
  }, []);

  if (organizations.length === 0) {
    return (
      <section id="organizations" className="bg-gray-50 px-2 py-8 sm:px-4 sm:py-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-unibridge-navy mb-4">Our Partner Organizations</h2>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-unibridge-navy">Our Partner Organizations</h2>
            <div className="mt-4 w-20 h-1 bg-unibridge-blue mx-auto md:mx-0"></div>
            <p className="mt-5 text-gray-600 text-base sm:text-lg max-w-3xl mx-auto md:mx-0">
              Organizations that have been verified through our process. Explore their mission, work, and impact.
            </p>
          </div>

          {/* Buttons moved to Home.jsx below Organizations section */}
        </div>

        {/* Mobile: swipeable row */}
        <div className="lg:hidden">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {featured.map((org) => (
              <Link
                key={org.id}
                to={`/organization/${org.id}`}
                className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  {org.profileImage ? (
                    <img src={org.profileImage} alt={org.name} className="w-full h-full object-cover" />
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
          <p className="mt-2 text-xs text-gray-500">Swipe to browse partners.</p>
        </div>

        {/* Desktop: clean grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {featured.map((org) => (
            <Link
              key={org.id}
              to={`/organization/${org.id}`}
              className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-52 overflow-hidden bg-gray-200">
                {org.profileImage ? (
                  <img
                    src={org.profileImage}
                    alt={org.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {/* Partner Action Buttons (moved here from Home.jsx) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-center my-8">
          <a
            href="/organizations"
            className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-unibridge-blue text-white font-semibold hover:bg-unibridge-navy transition"
          >
            View all organizations
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 rounded-2xl border border-gray-200 bg-white text-unibridge-navy font-semibold hover:bg-gray-100 transition"
          >
            Become a partner
          </a>
        </div>
    </section>
  );
};

export default Organizations;
