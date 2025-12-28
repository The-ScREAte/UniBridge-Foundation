import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import IntroVideo from '../components/IntroVideo';
import About from '../components/About';
import Organizations from '../components/Organizations';
import Opportunities from '../components/Opportunities';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <Hero />


      {/* Partners */}
      <Organizations />

      {/* Partner Action Buttons now rendered by Organizations section */}

      {/* Executive Summary */}
      <section className="ub-section">
        <div className="ub-container">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <h2 className="ub-section-title">
                How UniBridge works
              </h2>
              <p className="ub-section-lead max-w-2xl">
                We verify cases and partners, connect donors to clear needs, and share outcome updates—so giving is safe, personal,
                and accountable.
              </p>

              <div className="mt-8 space-y-4">
                {[ 
                  {
                    title: '1) We verify',
                    body: 'We confirm legitimacy through partners, documentation, and direct checks.'
                  },
                  {
                    title: '2) We connect',
                    body: 'Donors support a verified need with a clear goal and purpose.'
                  },
                  {
                    title: '3) We prove impact',
                    body: 'We share outcome updates so donors see what their help achieved.'
                  },
                ].map((card) => (
                  <div key={card.title} className="rounded-2xl bg-gray-50 border border-gray-200 p-6">
                    <h3 className="text-lg font-serif font-bold text-unibridge-navy">{card.title}</h3>
                    <p className="mt-2 text-gray-600 leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm text-gray-600">We don’t fund luxury. We fund lives.</p>
            </div>

            {/* Removed functional/instructional UI elements as requested */}
          </div>
        </div>
      </section>

      <Opportunities />

      <About />

      {/* Swipeable: Focus Areas */}
      <section className="ub-section-muted">
        <div className="ub-container">
          <div className="flex items-end justify-between gap-6 mb-7">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-unibridge-navy">Focus areas</h2>
              <p className="mt-2 text-gray-600">Swipe to explore the kinds of programs UniBridge can support.</p>
            </div>
            {/* Removed swipe/scroll instructions for small screens as requested */}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {[ 
              {
                title: 'Education Access',
                body: 'Scholarships, supplies, tutoring, school infrastructure, and teacher support.'
              },
              {
                title: 'Health & Wellness',
                body: 'Community health clinics, maternal health support, and essential supplies.'
              },
              {
                title: 'Youth Opportunity',
                body: 'Mentorship, career readiness, entrepreneurship training, and apprenticeships.'
              },
              {
                title: 'Women-Led Initiatives',
                body: 'Economic opportunity, leadership development, and local business acceleration.'
              },
              {
                title: 'Resilience & Recovery',
                body: 'Rapid response, rebuilding support, and community resilience planning.'
              },
              {
                title: 'Community Infrastructure',
                body: 'Water access, sanitation, and essential community systems.'
              },
            ].map((card) => (
              <div
                key={card.title}
                className="snap-start shrink-0 w-[86%] sm:w-[60%] md:w-[38%] lg:w-[30%] rounded-3xl bg-white border border-gray-200 p-7"
              >
                <div className="h-12 w-12 rounded-2xl bg-unibridge-blue/10 flex items-center justify-center">
                  <span className="text-unibridge-blue font-bold">{card.title.charAt(0)}</span>
                </div>
                <h3 className="mt-5 text-xl font-serif font-bold text-unibridge-navy">{card.title}</h3>
                <p className="mt-3 text-gray-600 leading-relaxed">{card.body}</p>
                <div className="mt-6 text-sm font-semibold text-unibridge-blue">Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation CTA */}
      <section id="donate" className="ub-section-muted">
        <div className="ub-container">
          <div className="rounded-3xl bg-white border border-gray-200 p-10 md:p-14">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2 className="ub-section-title">Give with confidence.</h2>
                <p className="ub-section-lead">
                  Your donation supports a verified case with clear goals. You’ll receive updates—because giving should feel safe,
                  personal, and real.
                </p>

                <div className="mt-6 grid gap-3">
                  {[
                    'Verified before posted',
                    'Clear purpose for every dollar',
                    'Updates after support is delivered'
                  ].map((line) => (
                    <div key={line} className="flex items-start gap-3">
                      <span className="mt-1 h-6 w-6 rounded-full bg-unibridge-blue/10 text-unibridge-blue flex items-center justify-center font-bold">✓</span>
                      <span className="text-gray-700">{line}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:info@unibridge.org?subject=Donation%20Inquiry"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-unibridge-blue text-white font-semibold hover:bg-unibridge-navy transition"
                  >
                    Donate now
                  </a>
                  <a
                    href="#opportunities"
                    className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-gray-200 bg-gray-50 text-unibridge-navy font-semibold hover:bg-gray-100 transition"
                  >
                    See verified cases
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-7">
                  <h3 className="text-lg font-serif font-bold text-unibridge-navy">What happens after you give</h3>
                  <div className="mt-4 space-y-3 text-gray-600">
                    {[ 
                      'Your gift is tied to a verified need with a clear goal.',
                      'Support is delivered through vetted partners or direct confirmation.',
                      'You receive outcome updates and progress reporting.'
                    ].map((line) => (
                      <div key={line} className="flex gap-3">
                        <span className="text-unibridge-blue font-bold">•</span>
                        <span className="leading-relaxed">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ub-section">
        <div className="ub-container max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-unibridge-navy">Frequently asked questions</h2>
            <p className="mt-3 text-gray-600">The donor‑trust questions people ask first.</p>
          </div>

          <div className="grid gap-4">
            {[ 
              {
                q: 'How do you verify cases?',
                a: 'We verify through trusted partners, documentation when available, and direct confirmation before anything is published.'
              },
              {
                q: 'Does my donation go directly to the person or project?',
                a: 'Donations are tied to a specific verified need and delivered through vetted partners or direct confirmation, with tracking and follow‑up.'
              },
              {
                q: 'Will I receive updates after donating?',
                a: 'Yes. We share progress updates so you can see what your support achieved.'
              },
              {
                q: 'How can an organization submit a case for verification?',
                a: 'Contact us with your organization details and the case context. We’ll follow up with verification steps and documentation requirements.'
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span className="text-lg font-serif font-semibold text-unibridge-navy">{item.q}</span>
                  <span className="shrink-0 h-9 w-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                    <svg className="w-4 h-4 text-unibridge-navy group-open:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <IntroVideo />
      <Footer />
    </div>
  );
};

export default Home;
