import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { organizationService } from '../utils/storage';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OrganizationsPage = () => {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await organizationService.getAllOrganizations();
      setOrganizations(orgs);
    };
    fetchOrganizations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-unibridge-navy mb-4">
              Our Partner Organizations
            </h1>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Verified organizations we're proud to support
            </p>
          </div>

          {organizations.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No partner organizations yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {organizations.map((org) => (
                <Link
                  key={org.id}
                  to={`/organization/${org.id}`}
                  className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {org.profileImage ? (
                      <img
                        src={org.profileImage}
                        alt={org.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    <h3 className="text-2xl font-bold text-unibridge-navy mb-3">
                      {org.name}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {org.description}
                    </p>
                    {org.partnerSince && (
                      <p className="text-sm text-gray-500 mb-3">
                        Partner since {org.partnerSince}
                      </p>
                    )}
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
