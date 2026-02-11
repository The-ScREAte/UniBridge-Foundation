import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { opportunityService } from '../utils/storage';
import { cacheManager } from '../utils/supabaseClient';

const Opportunities = ({ className = '' }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const startTime = performance.now();
    
    // If cached data exists, show it immediately for instant render
    const cached = cacheManager.get('all_opportunities');
    if (cached && Array.isArray(cached) && cached.length > 0) {
      setOpportunities(cached);
      setLoading(false);
    }

    opportunityService.getAllOpportunities({ onUpdate: (data) => mounted && setOpportunities(data) })
      .then((data) => {
        if (mounted) {
          console.log(`Opportunities loaded: ${data?.length || 0} items in ${Math.round(performance.now() - startTime)}ms`);
          setOpportunities(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load opportunities:', error);
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <section id="opportunities" className={`ub-section ${className}`.trim()}>
        <div className="ub-container">
          <div className="text-center mb-10">
            <h2 className="ub-section-title">Volunteering Needs & Service Opportunities</h2>
            <div className="mt-4 w-20 h-1 bg-unibridge-blue mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                <div className="bg-gray-200 aspect-[16/10]"></div>
                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (opportunities.length === 0) {
    return null;
  }

  // Show only first 6 for fast rendering
  const featured = opportunities.slice(0, 6);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((opp) => {
            const title = (opp.title || 'Opportunity').toString();
            const brief = (opp.brief || '').toString();
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
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unibridge-blue to-blue-600">
                      <span className="text-white text-4xl font-bold">{title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <div className="absolute left-4 bottom-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-unibridge-navy">
                      Verified opportunity
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-unibridge-navy group-hover:text-unibridge-blue transition-colors line-clamp-2">
                    {title}
                  </h3>

                  {brief ? (
                    <p className="mt-3 text-gray-600 leading-relaxed line-clamp-3">
                      {brief}
                    </p>
                  ) : (
                    <p className="mt-3 text-gray-500">Click to view details</p>
                  )}

                  <div className="mt-6 inline-flex items-center gap-2 text-unibridge-blue font-semibold">
                    View
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
