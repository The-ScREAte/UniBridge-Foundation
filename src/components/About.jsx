import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-10 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-10 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 bg-unibridge-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-7 h-7 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-unibridge-navy mb-3 text-center">We Find</h3>
            <p className="text-gray-600 text-center">
              We identify real needs and verified causes.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 bg-unibridge-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-7 h-7 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-unibridge-navy mb-3 text-center">We Connect</h3>
            <p className="text-gray-600 text-center">
              We channel support directly to the right hands.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 bg-unibridge-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-7 h-7 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-unibridge-navy mb-3 text-center">We Verify</h3>
            <p className="text-gray-600 text-center">
              We ensure transparency and accountability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
