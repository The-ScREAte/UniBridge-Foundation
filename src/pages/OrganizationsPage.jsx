import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { organizationService } from '../utils/storage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await organizationService.getAllOrganizations();
      setOrganizations(orgs);
    };
    fetchOrganizations();
  }, []);

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim().toLowerCase();
  }, [location.search]);

  const filtered = useMemo(() => {
    if (!query) return organizations;
    return organizations.filter((org) => {
      const haystack = `${org.name || ''} ${org.description || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [organizations, query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-unibridge-navy mb-4">
              Our Partner Organizations
            </h1>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Verified organizations we're proud to support
            </p>

            {query && (
              <p className="mt-5 text-sm text-gray-500">
                Showing results for <span className="font-semibold text-unibridge-navy">“{query}”</span>
              </p>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                {organizations.length === 0
                  ? 'No partner organizations yet.'
                  : 'No organizations match that search.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((org) => (
                <Link
                  key={org.id}
                  to={`/organization/${org.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {org.profileImage ? (
                      <img
                        src={org.profileImage}
                        alt={org.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                        <span className="text-white text-4xl font-bold">
                          {org.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-unibridge-navy mb-3">
                      {org.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {org.description}
                    </p>
                    <div className="flex items-center gap-3 mb-3">
                      {org.partnerSince && (
                        <p className="text-sm text-gray-500">
                          Partner since {org.partnerSince}
                        </p>
                      )}
                      {org.linkUrl && org.linkName && (
                        <>
                          <span className="text-gray-400">•</span>
                          <a
                            href={org.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-unibridge-blue font-medium"
                          >
                            {org.linkName}
                          </a>
                        </>
                      )}
                    </div>
                    <div className="text-unibridge-blue font-medium text-sm">
                      View Impact →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrganizationsPage;
