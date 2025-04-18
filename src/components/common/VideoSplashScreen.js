import React, { useEffect, useRef } from 'react';

import videoSrc from "../../assets/swiftbite-intro.mp4"
import styles from "../../styles/VideoSplashScreen.module.css";

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
    <div className={styles.container}>
      <video
        ref={videoRef}
        src={videoSrc}
        className={styles.video}
        muted
        autoPlay
      />
    </div>
  );
};

export default VideoSplashScreen;
