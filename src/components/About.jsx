import React from 'react';

const About = ({ className = '' }) => {
  return (
    <section id="about" className={`pt-5 ${className}`.trim()}>
      <div className="ub-container">
        <div className="text-center mb-5 md:mb-7">
          <h2 className="ub-section-title mb-4">
            Built for <em className="text-unibridge-blue not-italic font-display italic">trust</em>. Designed for <em className="text-unibridge-blue not-italic font-display italic">impact</em>.
          </h2>
          <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            UniBridge verifies needs and connects support to people and projects that truly need help—backed by accountability and
            follow‑up updates.
          </p>
          <p className="text-script text-2xl sm:text-3xl text-unibridge-navy mt-6">Partners of Human Potential</p>
        </div>
      </div>
    </section>
  );
};

export default About;
