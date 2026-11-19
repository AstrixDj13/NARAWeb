import React, { useEffect, useRef, useState } from "react";

/**
 * One full-screen reel. The YouTube player (heavy: ~1 MB+ per embed) is only created when
 * this reel is on screen or one screen away; otherwise a lightweight thumbnail is shown.
 * Players far from view are removed again, which also stops them playing in the background.
 */
const VideoFeedItem = ({ videoId, rootRef }) => {
  const boxRef = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      // Root is the feed's scroll container; 50% margin = the reel just above and below also load
      { root: rootRef?.current || null, rootMargin: "50% 0px 50% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootRef]);

  return (
    <div
      ref={boxRef}
      className="h-screen w-full snap-start snap-always relative bg-black flex items-center justify-center"
    >
      {near ? (
        <iframe
          className="w-full h-full max-w-[500px] object-cover pointer-events-auto"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&loop=1&playlist=${videoId}&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="w-full h-full max-w-[500px] object-contain opacity-60"
        />
      )}
    </div>
  );
};

export default VideoFeedItem;
