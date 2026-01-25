import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { opportunityService } from '../utils/storage';

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);

  useEffect(() => {
    const fetchOpportunity = async () => {
      const data = await opportunityService.getOpportunityById(id, { onUpdate: setOpportunity });
      setOpportunity(data);
    };
    fetchOpportunity();
  }, [id]);

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-unibridge-navy mb-4">
              Opportunity Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The opportunity you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="inline-block bg-unibridge-blue text-white px-8 py-3 rounded-lg hover:bg-unibridge-navy transition-colors font-semibold"
            >
              Return Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              to="/#opportunities" 
              className="inline-flex items-center text-unibridge-blue hover:text-unibridge-navy mb-6 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Opportunities
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-unibridge-navy mb-6">
              {opportunity.title}
            </h1>
            <div className="w-20 h-1 bg-unibridge-blue"></div>
          </div>

          {/* Main Image */}
          {opportunity.image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
              <img
                src={opportunity.image}
                alt={opportunity.title}
                className="w-full max-h-[520px] object-cover sm:object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Brief Description */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-unibridge-navy mb-4">Overview</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                {opportunity.brief}
              </p>
            </div>

            {/* Detailed Description */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-unibridge-navy mb-4">Details</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {opportunity.details}
                </p>
              </div>
            </div>

            {/* Requirements (if any) */}
            {opportunity.requirements && (
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-unibridge-navy mb-4">Requirements</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {opportunity.requirements}
                </p>
              </div>
            )}

            {/* Contact/Location Info */}
            <div className="bg-unibridge-blue/5 rounded-lg p-6">
              {opportunity.location && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-unibridge-navy mb-2">Location</h3>
                  <p className="text-gray-700">{opportunity.location}</p>
                </div>
              )}
              {opportunity.duration && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-unibridge-navy mb-2">Duration</h3>
                  <p className="text-gray-700">{opportunity.duration}</p>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <div className="mt-12 text-center">
              <Link
                to="/contact"
                className="inline-block bg-unibridge-blue text-white px-12 py-4 rounded-lg hover:bg-unibridge-navy transition-colors font-bold text-lg shadow-lg hover:shadow-xl"
              >
                Apply for This Opportunity
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OpportunityDetail;
