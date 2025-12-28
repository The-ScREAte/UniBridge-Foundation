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
      <section id="organizations" className="py-5 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-unibridge-navy mb-4">
              Our Partner Organizations
            </h2>
            <div className="w-20 h-1 bg-unibridge-blue mx-auto"></div>
          </div>
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No partner organizations yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="organizations" className="py-5 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-unibridge-navy mb-3 sm:mb-4">
            Our Partner Organizations
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-unibridge-blue mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {organizations.map((org) => (
            <Link
              key={org.id}
              to={`/organization/${org.id}`}
              className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="relative h-40 sm:h-52 md:h-64 overflow-hidden bg-gray-200">
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
              
              <div className="p-3 sm:p-4 md:p-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-unibridge-navy mb-2 sm:mb-3">
                  {org.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 line-clamp-2 leading-relaxed mb-2 sm:mb-4">
                  {org.description}
                </p>
                <div className="text-unibridge-blue font-medium text-xs sm:text-sm">
                  View Impact →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Organizations;
