import React, { useState, useEffect } from 'react';
import { heroService } from '../utils/storage';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [heroContent, setHeroContent] = useState({
    title: 'We care for those you love.',
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
    <section
      className="relative text-white px-0 mb-0 lg:mb-0 min-h-[70svh] sm:min-h-[65vh] lg:min-h-[75vh] flex items-start pb-12 sm:pb-16"
      style={{ background: 'none', paddingTop: 'calc(env(safe-area-inset-top) + 11rem)' }}
    >
      <div className="absolute inset-0 w-full h-full z-0">
        {heroContent.use_video && heroContent.background_video ? (
          <>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-full object-cover object-center"
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
            />
            <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none" style={{ zIndex: 1, background: 'linear-gradient(to bottom, rgba(30,58,95,0.8) 0%, rgba(37,99,168,0.6) 80%, transparent 100%)' }} />
          </>
        )}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-lg">
            We care for<br />those you love.
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl text-blue-50/95 leading-relaxed max-w-3xl mx-auto drop-shadow font-semibold">
            We connect donors to verified Organizations and Individuals—so your giving reaches the right hands with clear purpose,
            accountability, and follow‑up updates.
          </p>
          

          <div className="mt-6 sm:mt-8 md:mt-10 flex justify-center">
            <a
              href="#organizations"
              className="inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-semibold bg-white text-unibridge-navy border-2 border-white rounded-md hover:bg-transparent hover:text-white transition-colors duration-300"
            >
              See those in need
            </a>
          </div>


        </div>
      </div>
    </section>
  );
};

export default Hero;
