import React from 'react';

const About = ({ className = '' }) => {
  return (
    <section id="about" className={`ub-section ${className}`.trim()}>
      <div className="ub-container">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="ub-section-title mb-4">
            Built for trust. Designed for impact.
          </h2>
          <div className="w-20 h-1 bg-unibridge-blue mx-auto mb-6"></div>
          <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            UniBridge verifies needs and connects support to people and projects that truly need help—backed by accountability and
            follow‑up updates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-10 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 bg-unibridge-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-7 h-7 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-unibridge-navy mb-3 text-center">We Find</h3>
            <p className="text-gray-600 text-center">
              We identify real people and organizations facing urgent needs.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 bg-unibridge-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-7 h-7 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-unibridge-navy mb-3 text-center">We Verify</h3>
            <p className="text-gray-600 text-center">
              We confirm legitimacy before any case is published.
            </p>
          </div>

          <div className="bg-gray-50 p-10 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-14 h-14 bg-unibridge-blue/10 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-7 h-7 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-unibridge-navy mb-3 text-center">We Deliver Proof</h3>
            <p className="text-gray-600 text-center">
              We provide updates so donors see what their help achieved.
            </p>
          </div>
        </div>

        <div className="mt-10 md:mt-14 grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Verification first',
              body: 'We confirm legitimacy before publishing needs or accepting partners.'
            },
            {
              title: 'Clear purpose',
              body: 'Each case has defined goals so support is focused and accountable.'
            },
            {
              title: 'Updates included',
              body: 'We share progress updates after support is delivered.'
            }
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6">
              <h4 className="text-lg font-bold text-unibridge-navy">{item.title}</h4>
              <p className="mt-2 text-gray-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
