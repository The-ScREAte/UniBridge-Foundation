import React, { useState, useEffect } from 'react';
import { heroService } from '../utils/storage';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    title: 'We Love Those You Love.',
    background_image: '/hero.png',
    background_video: null,
    use_video: false
  });

  useEffect(() => {
    const fetchHeroContent = async () => {
      const content = await heroService.getHeroContent();
      setHeroContent(content);
    };
    fetchHeroContent();
  }, []);

  return (
    <section className="relative text-white pt-0 pb-0 px-0 mb-0 lg:mb-0 min-h-[68vh] lg:min-h-[80h] flex items-center" style={{ background: 'none' }}>
      <div className="absolute inset-0 w-full h-full z-0">
        {heroContent.use_video && heroContent.background_video ? (
          <>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover object-center"
              style={{ minHeight: 400, maxHeight: 600, width: '100%' }}
            >
              <source src={heroContent.background_video} type="video/mp4" />
            </video>
            <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none" style={{ zIndex: 1, background: 'linear-gradient(to bottom, rgba(30,58,95,0.8) 0%, rgba(37,99,168,0.6) 80%, transparent 100%)' }} />
          </>
        ) : (
          <>
            <img 
              src={heroContent.background_image || '/hero.png'} 
              alt="UniBridge Hero" 
              className="w-full h-full object-cover object-center" 
              style={{ minHeight: 400, maxHeight: 600, width: '100%' }}
            />
            <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none" style={{ zIndex: 1, background: 'linear-gradient(to bottom, rgba(30,58,95,0.8) 0%, rgba(37,99,168,0.6) 80%, transparent 100%)' }} />
          </>
        )}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
            WE LOVE THOSE YOU LOVE
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-blue-50/95 leading-relaxed max-w-3xl mx-auto drop-shadow">
            We connect donors to verified people and community projects—so your giving reaches the right hands with clear purpose,
            accountability, and follow‑up updates.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#donate"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-full bg-white text-unibridge-navy font-semibold hover:bg-blue-50 transition"
            >
              Donate now
            </a>
            <a
              href="#opportunities"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-full bg-white/10 border border-white/25 text-white font-semibold hover:bg-white/15 transition"
            >
              See verified cases
            </a>
          </div>

          <p className="mt-4 text-sm text-blue-50/90">
            Every case is verified. Every donation is tracked. Every story is real.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
