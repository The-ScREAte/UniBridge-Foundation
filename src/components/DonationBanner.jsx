import React, { useState, useEffect } from 'react';
import { donationService } from '../utils/storage';

const DonationBanner = () => {
  const [activeDonations, setActiveDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      const donations = await donationService.getActiveDonations({ onUpdate: setActiveDonations });
      setActiveDonations(donations);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (activeDonations.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-unibridge-blue to-unibridge-navy py-12">
      <div className="ub-container">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white text-center mb-8">
            Support Our Causes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {activeDonations.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {donation.image && (
                  <img
                    src={donation.image}
                    alt={donation.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-unibridge-navy mb-3">
                    {donation.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {donation.description}
                  </p>
                  <a
                    href={donation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 bg-unibridge-blue text-white font-semibold rounded-lg hover:bg-unibridge-navy transition-colors duration-300"
                  >
                    Donate Now
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationBanner;
