import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import VideoFeedItem from "../components/videoFeed/VideoFeedItem";

const VideoFeed = () => {
  const navigate = useNavigate();
  const feedRef = useRef(null);

  // Hardcoded list of video IDs to use for now
  // Replace or add your YouTube Video IDs here!
  const videoIds = [
    // Try-ons added 18 Nov 2026 (newest first)
    "XcZuc8EXrko", // Inara Top TRY ON
    "0M3nKiZGmn4", // Faux 9 to 5 Blazer TRY ON
    "_XyLPUTQ_Cc", // Plum top (navy blue stripes) TRY ON
    "t5D_z-KeJGo", // Olive Shirt TRY ON
    "bdLtujBiwZo", // Sera Top TRY ON
    "yBptQddwYTE", // Dune Shirt TRY ON
    "9dYal666hsc", // Noir Shirt TRY ON
    "_nF7EWZD9ac", // Chai latte Shirt TRY ON
    "GIWzreSC37o", // Red on the run top TRY ON
    "WK3z1RrzV08", // Vera Shrug
    // Earlier videos
    "CmS8bh8Eb_Q", // Ira Top Video
    "5_IpIvyCMmk", // Take a beat, with AAINA
    "oCs6dzHaEF8", // The Liora skirt
    "G7O4nsOifaI", // The Pearl dress
    "nHXw5F-Ay8M", // Outfit Roulette with AAINA
    "ljvp_TsUgt0", // FIT CHECK in GOA
  ];

  return (
    <div ref={feedRef} className="bg-black w-full h-screen overflow-y-scroll snap-y snap-mandatory relative font-outfit">

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
          <VideoFeedItem key={id} videoId={id} rootRef={feedRef} />
        ))}
      </div>

    </div>
  );
};

export default VideoFeed;
