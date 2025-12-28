import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { opportunityService } from '../utils/storage';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      const data = await opportunityService.getAllOpportunities();
      setOpportunities(data);
    };
    fetchOpportunities();
  }, []);

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <section id="opportunities" className="py-5 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 md:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-unibridge-navy mb-3 sm:mb-4">
            Volunteering Needs & Service Opportunities
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-unibridge-blue mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {opportunities.map((opp) => (
            <Link
              key={opp.id}
              to={`/opportunity/${opp.id}`}
              className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 text-sm mx-auto"
              style={{ minHeight: 0, maxWidth: 270, width: '100%' }}
            >
              <div className="relative h-28 sm:h-32 overflow-hidden bg-gray-200">
                {opp.image ? (
                  <img
                    src={opp.image}
                    alt={opp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                    <span className="text-white text-2xl font-bold">
                      {opp.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2 sm:p-2.5">
                <h3 className="text-sm sm:text-base font-bold text-unibridge-navy mb-1 group-hover:text-unibridge-blue transition-colors">
                  {opp.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-snug mb-1">
                  {opp.brief}
                </p>
                <div className="text-unibridge-blue font-semibold text-xs flex items-center gap-2">
                  Learn More
                  <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Opportunities;
