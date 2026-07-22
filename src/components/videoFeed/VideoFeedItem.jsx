import React from "react";

const VideoFeedItem = ({ videoId }) => {
  return (
    <div className="h-screen w-full snap-start snap-always relative bg-black flex items-center justify-center">
      <iframe
        className="w-full h-full max-w-[500px] object-cover pointer-events-auto"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&loop=1&playlist=${videoId}&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoFeedItem;
