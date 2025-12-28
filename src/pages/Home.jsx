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
                  Your donation supports a verified case with clear goals. You'll receive updates—because giving should feel safe,
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
                  <div className="mt-6 text-sm font-semibold text-unibridge-blue">Learn more →</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Home;
