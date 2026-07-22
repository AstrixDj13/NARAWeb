import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import VideoFeedItem from "../components/videoFeed/VideoFeedItem";

const VideoFeed = () => {
  const navigate = useNavigate();

  // Hardcoded list of video IDs to use for now
  // Replace or add your YouTube Video IDs here!
  const videoIds = [
    "CmS8bh8Eb_Q", // Ira Top Video
    //"CmS8bh8Eb_Q", // Placeholder 2
    //"CmS8bh8Eb_Q", // Placeholder 3
    //"CmS8bh8Eb_Q", // Placeholder 4
  ];

  return (
    <div className="bg-black w-full h-screen overflow-y-scroll snap-y snap-mandatory relative font-outfit">

      {/* Fixed Header / Back Button */}
      <div className="fixed top-0 left-0 w-full p-4 z-50 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <button
          onClick={() => navigate(-1)}
          className="text-white bg-black/40 p-2 rounded-full backdrop-blur-sm pointer-events-auto hover:bg-black/60 transition-colors"
        >
          <HiArrowLeft size={24} />
        </button>
        <div className="text-white font-bold text-lg tracking-wider pointer-events-auto drop-shadow-md">
          NARA REELS
        </div>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Feed Container */}
      <div className="flex flex-col w-full">
        {videoIds.map((id, index) => (
          <VideoFeedItem key={index} videoId={id} />
        ))}
      </div>

    </div>
  );
};

export default VideoFeed;
