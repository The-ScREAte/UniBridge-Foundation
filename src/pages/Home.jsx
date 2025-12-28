import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import IntroVideo from '../components/IntroVideo';
import About from '../components/About';
import Organizations from '../components/Organizations';
import Opportunities from '../components/Opportunities';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        {/* Mission Statement */}
        <section>
          <div className="ub-container pb-8">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-light text-gray-800 leading-tight">
                Our mission is to create a world where{' '}
                <em className="font-display italic text-unibridge-blue not-italic">every</em> person has the opportunity to live a{' '}
                <em className="font-display italic text-unibridge-blue not-italic">healthy</em>, productive life.
              </h2>
              <a 
                href="/about" 
                className="inline-block mt-8 sm:mt-10 px-7 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-unibridge-navy border-2 border-unibridge-navy rounded-md hover:bg-unibridge-navy hover:text-white transition-colors duration-300"
              >
                Learn more about our role
              </a>
            </div>
          </div>
        </section>
        {/* Partners */}
        <Organizations />
        {/* Partner Action Buttons now rendered by Organizations section */}
        <Opportunities />
        <About />
        {/* Video and Donation CTA */}
        <section>
          <div className="ub-container">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <IntroVideo />
              </div>
              <div className="lg:col-span-5">
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-unibridge-navy leading-tight">Give with confidence.</h2>
                <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                  Your donation supports a verified People with clear goals. You'll receive updates—because giving should feel safe,
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
                <div className="my-5 flex justify-center">
                  <a
                    href="mailto:info@unibridge.org?subject=Donation%20Inquiry"
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-7 sm:py-3.5 text-base font-semibold bg-unibridge-navy text-white border-2 border-unibridge-navy rounded-md hover:bg-white hover:text-unibridge-navy transition-colors duration-300"
                  >
                    Donate now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Swipeable: Focus Areas */}
        <section className="ub-section-muted pt-0">
          <div className="ub-container">
            <div className="flex items-end justify-between gap-6 mb-7 pt-5">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-unibridge-navy">Focus areas</h2>
                <p className="mt-2 text-gray-600 hidden sm:block">Swipe to explore the kinds of programs UniBridge can support.</p>
              </div>
              {/* Removed swipe/scroll instructions for small screens as requested */}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {[
                { title: 'Education Access', body: 'Scholarships, supplies, tutoring, school infrastructure, and teacher support.' },
                { title: 'Health & Wellness', body: 'Community health clinics, maternal health support, and essential supplies.' },
                { title: 'Youth Opportunity', body: 'Mentorship, career readiness, entrepreneurship training, and apprenticeships.' },
                { title: 'Women-Led Initiatives', body: 'Economic opportunity, leadership development, and local business acceleration.' },
                { title: 'Resilience & Recovery', body: 'Rapid response, rebuilding support, and community resilience planning.' },
                { title: 'Community Infrastructure', body: 'Water access, sanitation, and essential community systems.' }
              ].map(card => (
                <div
                  key={card.title}
                  className="snap-start shrink-0 w-[86%] sm:w-[60%] md:w-[38%] lg:w-[30%] rounded-3xl bg-white border border-gray-200 p-7"
                >
                  <div className="h-12 w-12 rounded-2xl bg-unibridge-blue/10 flex items-center justify-center">
                    <span className="text-unibridge-blue font-bold">{card.title.charAt(0)}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-serif font-bold text-unibridge-navy">{card.title}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">{card.body}</p>
                  <Link to="/about" className="mt-6 inline-block text-sm font-semibold text-unibridge-blue hover:text-unibridge-navy transition-colors">Learn more →</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="bg-white py-5">
          <div className="ub-container">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-unibridge-blue/10 mb-2 sm:mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light text-unibridge-navy mb-1">2024</div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Operating Since</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-unibridge-blue/10 mb-2 sm:mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light text-unibridge-navy mb-1">20+</div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Partner Organizations</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-unibridge-blue/10 mb-2 sm:mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light text-unibridge-navy mb-1">200+</div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Lives Impacted</p>
              </div>
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-unibridge-blue/10 mb-2 sm:mb-3">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-unibridge-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light text-unibridge-navy mb-1">5+</div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Countries Reached</p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Home;
