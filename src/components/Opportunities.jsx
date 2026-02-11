import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { opportunityService } from '../utils/storage';
import { cacheManager } from '../utils/supabaseClient';

const Opportunities = ({ className = '' }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Clear any stale cache to force a fresh fetch (preload may have stored empty [])
    cacheManager.clear('all_opportunities');

    console.log('🔄 Opportunities: Fetching fresh...');
    opportunityService.getAllOpportunities({
      onUpdate: (data) => {
        console.log('🔔 Opportunities: onUpdate', data?.length, 'items');
        if (mounted) {
          setOpportunities(data || []);
          setHasLoaded(true);
          setLoading(false);
        }
      }
    })
      .then((data) => {
        console.log('✅ Opportunities: Loaded', data?.length, 'items', data);
        if (mounted) {
          setOpportunities(data || []);
          setLoading(false);
          setHasLoaded(true);
        }
      })
      .catch((error) => {
        console.error('❌ Opportunities: Error', error);
        if (mounted) {
          setLoading(false);
          setHasLoaded(true);
        }
      });
    return () => { mounted = false; };
  }, []);

  console.log('🎬 Opportunities: Render - loading:', loading, 'count:', opportunities?.length, 'hasLoaded:', hasLoaded);

  if (loading) {
    console.log('⏳ Opportunities: Showing skeleton');
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

  // Don't show empty state until loading is done AND we have no opportunities
  if (!loading && hasLoaded && (!opportunities || opportunities.length === 0)) {
    console.log('⚠️ Opportunities: Empty, showing message');
    return (
      <section id="opportunities" className={`ub-section ${className}`.trim()}>
        <div className="ub-container">
          <div className="text-center py-12">
            <h2 className="ub-section-title">Volunteering Needs & Service Opportunities</h2>
            <div className="mt-4 w-20 h-1 bg-unibridge-blue mx-auto"></div>
            <p className="mt-8 text-gray-500 text-lg">No opportunities available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  // If we have opportunities, show them even if still loading
  if (opportunities && opportunities.length > 0) {
    console.log('🎨 Opportunities: Rendering', opportunities.length, 'items');
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
  }

  // Still loading and no data yet
  console.log('⏳ Opportunities: Still loading with no data yet');
  return null;
};

export default Opportunities;
