import React, { useEffect, useRef } from 'react';

import videoSrc from "../../assets/swiftbite-intro.mp4"

const VideoSplashScreen = ({ onFinish }) => {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
      video.onended = () => {
        onFinish(); // Trigger when video ends
      };
    }
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        muted
        autoPlay
      />
    </div>
  );
};

export default VideoSplashScreen;
