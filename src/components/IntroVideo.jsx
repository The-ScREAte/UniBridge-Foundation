import React, { useState, useEffect } from 'react';
import { introVideoService } from '../utils/storage';

const IntroVideo = ({ className = 'lg:col-span-7', onStatusChange }) => {
  const [videoContent, setVideoContent] = useState({
    video_url: null,
    is_active: false
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      const content = await introVideoService.getIntroVideo();
      setVideoContent(content);
      setIsVisible(true);
    };
    fetchVideo();
  }, []);

  useEffect(() => {
    if (typeof onStatusChange === 'function') {
      const hasVideo = Boolean(videoContent?.is_active && videoContent?.video_url);
      onStatusChange(hasVideo);
    }
  }, [videoContent, onStatusChange]);

  if (!videoContent.is_active || !videoContent.video_url) {
    return null;
  }

  return (
    <section className={className}>
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
              preload="auto"
              className="w-full h-[200px] sm:h-[300px] lg:h-[360px]"
              style={{ objectFit: 'cover', display: 'block', background: '#000' }}
            >
              Sorry, your browser does not support embedded videos.
            </video>
          ) : (
            <div
              className="w-full h-[200px] sm:h-[300px] lg:h-[360px] flex items-center justify-center bg-gray-900 text-white text-sm"
              aria-busy="true"
            >
              Loading…
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IntroVideo;
