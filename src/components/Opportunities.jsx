import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { opportunityService } from '../utils/storage';

const Opportunities = ({ className = '' }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const data = await opportunityService.getAllOpportunities({ onUpdate: setOpportunities });
        setOpportunities(data);
      } catch (error) {
        console.error('Failed to load opportunities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  if (loading) {
    return null; // Or show a loading skeleton
  }

  if (opportunities.length === 0) {
    return null;
  }

  return (
    <section id="opportunities" className={`ub-section ${className}`.trim()}>
      <div className="ub-container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 pt-5">
          <div className="text-center md:text-left">
            <h2 className="ub-section-title">
              Volunteering Needs & Service Opportunities
            </h2>
            <div className="mt-4 w-20 h-1 bg-unibridge-blue mx-auto md:mx-0"></div>
          </div>
        </div>

        {/* Mobile: two-row horizontal scroller so more cards stay visible */}
        <div className="lg:hidden">
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(220px,1fr)] sm:auto-cols-[minmax(260px,1fr)] gap-3 overflow-x-auto pb-4 pr-4 snap-x snap-mandatory">
            {opportunities.map((opp) => {
              const title = (opp.title || 'Opportunity').toString();
              const brief = (opp.brief || opp.details || '').toString();
              return (
                <Link
                  key={opp.id}
                  to={`/opportunity/${opp.id}`}
                  className="snap-start rounded-2xl bg-white border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative overflow-hidden bg-gray-200 aspect-[4/3]">
                    {opp.image ? (
                      <img
                        src={opp.image}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                        <span className="text-white text-2xl font-bold">{title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-unibridge-navy line-clamp-2">{title}</h3>
                    <p className="mt-2 text-xs text-gray-600 line-clamp-3 leading-relaxed">
                      {brief || 'Tap to view details.'}
                    </p>
                    <div className="mt-3 text-xs font-semibold text-unibridge-blue inline-flex items-center gap-2">
                      View
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Desktop: clean grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => {
            const title = (opp.title || 'Opportunity').toString();
            const brief = (opp.brief || opp.details || '').toString();
            return (
              <Link
                key={opp.id}
                to={`/opportunity/${opp.id}`}
                className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative overflow-hidden bg-gray-200 aspect-[16/10]">
                  {opp.image ? (
                      <img
                        src={opp.image}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                      <span className="text-white text-4xl font-bold">{title.charAt(0)}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute left-4 bottom-4 right-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-unibridge-navy">
                      Verified opportunity
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-unibridge-navy group-hover:text-unibridge-blue transition-colors">
                    {title}
                  </h3>

                  {brief ? (
                    <p className="mt-3 text-gray-600 leading-relaxed line-clamp-3">
                      {brief}
                    </p>
                  ) : (
                    <p className="mt-3 text-gray-500 leading-relaxed">
                      Details coming soon. Click to view the full opportunity.
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Learn more</span>
                    <span className="inline-flex items-center gap-2 text-unibridge-blue font-semibold">
                      View
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Opportunities;
