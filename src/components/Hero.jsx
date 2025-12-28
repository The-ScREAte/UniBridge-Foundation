import React, { useState, useEffect } from 'react';
import { heroService } from '../utils/storage';

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
    <section className="relative text-white pt-40 pb-48 px-4" style={{ background: 'none' }}>
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
            <div className="absolute inset-0 bg-gradient-to-b from-unibridge-navy/80 to-unibridge-blue/60" />
          </>
        ) : (
          <>
            <img 
              src={heroContent.background_image || '/hero.png'} 
              alt="UniBridge Hero" 
              className="w-full h-full object-cover object-center" 
              style={{ minHeight: 400, maxHeight: 600, width: '100%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-unibridge-navy/80 to-unibridge-blue/60" />
          </>
        )}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-lg">
            {heroContent.title}
          </h1>
        </div>
      </div>
      {/* Decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path 
            fill="#ffffff" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
