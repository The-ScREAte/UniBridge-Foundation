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
    <div
      ref={videoRef}
      className="relative z-20 flex justify-center px-4 sm:px-0"
      style={{ marginTop: '-180px', marginBottom: '-20px' }}
    >
      <div
        className="shadow-2xl rounded-2xl overflow-hidden border-4 border-white w-full"
        style={{ background: '#fff', maxWidth: 600 }}
      >
        {isVisible ? (
          <video 
            src={videoContent.video_url}
            autoPlay
            muted
            loop
            controls
            playsInline
            preload="metadata"
            className="w-full h-[250px] sm:h-[320px]"
            poster={videoContent.poster_url}
            style={{ objectFit: 'cover', display: 'block', background: '#000' }}
          >
            Sorry, your browser does not support embedded videos.
          </video>
        ) : (
          <div 
            className="w-full h-[250px] sm:h-[320px] flex items-center justify-center bg-gray-900"
            style={{ 
              backgroundImage: videoContent.poster_url ? `url(${videoContent.poster_url})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="text-white text-sm">Loading...</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntroVideo;
