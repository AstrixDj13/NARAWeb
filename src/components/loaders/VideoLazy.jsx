import React, { useEffect, useRef, useCallback } from 'react';
import { useIsVisible } from '../../hooks/useInvisible'; 

const VideoLazy = ({ src, poster, alt, style, classes }) => {
  const { isVisible, targetRef } = useIsVisible(
    {
      root: null,
      rootMargin: '-50px',
      threshold: 0.1,
    },
    false
  );

  const videoRef = useRef(null);

  const startVideoOnMouseMove = useCallback(async () => {
    try {
      await videoRef.current.play();
    } catch (e) {
      // do nothing
    }
  }, []);

  const stopVideoOnMove = useCallback(() => {
    try {
      videoRef.current.pause();
    } catch (e) {
      // do nothing
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      startVideoOnMouseMove();
    } else {
      stopVideoOnMove();
    }
  }, [isVisible, startVideoOnMouseMove, stopVideoOnMove]);

  return (
    <span
      ref={targetRef}
      style={{
        position: 'relative',
        minHeight: '50px',
        height: '100%',
      }}
    >
      <video
        ref={videoRef}
        loop
        muted
        className={classes}
        autoPlay={false}
        preload="none"
        playsInline
        poster={poster}
        aria-label={alt}
        style={{
          objectFit: 'cover',
          display: 'block',
          width: '100%',
          height: '100%',
          ...style,
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag. Please try viewing this page in a modern browser.
      </video>
    </span>
  );
};

export default VideoLazy;
