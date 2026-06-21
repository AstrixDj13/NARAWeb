import React, { useState, useEffect } from 'react';
import { IoClose, IoExpand, IoContract } from 'react-icons/io5';

const ProductVideoPopup = ({ productTitle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // You can replace this ID with the actual YouTube video ID
  const YOUTUBE_VIDEO_ID = "CmS8bh8Eb_Q"; 

  useEffect(() => {
    // Only show for "The Ira Top"
    if (!productTitle || !productTitle.toLowerCase().includes("ira top")) {
      return;
    }

    if (sessionStorage.getItem('ira_video_dismissed')) {
      setIsDismissed(true);
      return;
    }

    // Show after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [productTitle]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
      sessionStorage.setItem('ira_video_dismissed', 'true');
    }, 500); // Wait for exit transition
  };

  if (isDismissed || !productTitle || !productTitle.toLowerCase().includes("ira top")) return null;

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={isExpanded 
        ? `fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 font-antikor transition-opacity duration-500 p-4 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
        : `fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[9998] w-[200px] md:w-[220px] font-antikor transition-all duration-700 ease-out transform ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0 pointer-events-none'
      }`}
    >
      <div className={isExpanded 
        ? "bg-black p-2 md:p-3 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative border border-gray-700 h-[85vh] aspect-[9/16] flex flex-col"
        : "bg-black/90 p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative border border-gray-800 backdrop-blur-md"
      }>
        
        <button 
          onClick={handleDismiss} 
          className={`absolute -top-3 -right-3 bg-white text-black rounded-full p-1 shadow-md hover:scale-110 transition-transform z-20 ${isExpanded ? 'md:-top-4 md:-right-4 p-2' : ''}`}
          aria-label="Close"
        >
           <IoClose size={isExpanded ? 20 : 16} />
        </button>
        
        {!isExpanded && (
          <div className="text-white text-xs font-semibold mb-2 flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            See it in action
          </div>
        )}

        <div className={`relative w-full rounded-lg overflow-hidden bg-gray-900 ${isExpanded ? 'flex-1' : 'aspect-[9/16]'}`}>
          <button
            onClick={toggleExpand}
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-md backdrop-blur-sm transition-all"
            aria-label={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <IoContract size={18} /> : <IoExpand size={18} />}
          </button>
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&controls=1&mute=${isExpanded ? 0 : 1}&loop=1&playlist=${YOUTUBE_VIDEO_ID}`} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default ProductVideoPopup;
