import React, { useState, useEffect, useRef } from 'react';
import { introVideoService } from '../utils/storage';

const IntroVideo = () => {
  const [videoContent, setVideoContent] = useState({
    video_url: '/unibridge-intro.mp4',
    poster_url: '/video-poster.jpg',
    title: 'UniBridge Introduction',
    is_active: true
  });
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const content = await introVideoService.getIntroVideo();
      setVideoContent(content);
    };
    fetchVideo();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!videoContent.is_active || !videoContent.video_url) {
    return null;
  }

  return (
    <section ref={videoRef} className="ub-section">
      <div className="ub-container">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-unibridge-blue/10 text-unibridge-blue">
              Featured video
            </div>
            <h2 className="mt-4 text-3xl sm:text-4xl font-serif font-bold text-unibridge-navy leading-tight">
              {videoContent.title || 'UniBridge Introduction'}
            </h2>
            <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed">
              In one minute, this video explains UniBridge’s mission and how we work with communities, donors, and partners to
              deliver real, accountable support.
            </p>
            <div className="mt-6 grid gap-3">
              {[ 
                'Verified partners and projects',
                'Clear outcomes and ongoing updates',
                'Donor, volunteer, and partner pathways'
              ].map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className="mt-1 h-6 w-6 rounded-full bg-unibridge-blue/10 text-unibridge-blue flex items-center justify-center font-bold">✓</span>
                  <span className="text-gray-700">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-gray-200 p-2 sm:p-3">
              <div className="rounded-2xl overflow-hidden bg-black">
                  {isVisible ? (
                    <video
                      src={videoContent.video_url}
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-[220px] sm:h-[340px] lg:h-[420px]"
                      poster={videoContent.poster_url}
                      style={{ objectFit: 'cover', display: 'block', background: '#000' }}
                    >
                      Sorry, your browser does not support embedded videos.
                    </video>
                  ) : (
                    <div
                      className="w-full h-[220px] sm:h-[340px] lg:h-[420px] flex items-center justify-center bg-gray-900"
                      style={{
                        backgroundImage: videoContent.poster_url ? `url(${videoContent.poster_url})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="text-white text-sm">Loading…</div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroVideo;
