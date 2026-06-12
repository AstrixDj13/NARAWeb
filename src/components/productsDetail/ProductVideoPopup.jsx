import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const ProductVideoPopup = ({ productTitle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

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

  return (
    <div 
      className={`fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[9998] w-[200px] md:w-[220px] font-antikor transition-all duration-700 ease-out transform ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-black/90 p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.4)] relative border border-gray-800 backdrop-blur-md">
        
        <button 
          onClick={handleDismiss} 
          className="absolute -top-3 -right-3 bg-white text-black rounded-full p-1 shadow-md hover:scale-110 transition-transform z-10"
          aria-label="Close"
        >
           <IoClose size={16} />
        </button>
        
        <div className="text-white text-xs font-semibold mb-2 flex items-center gap-2 px-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          See it in action
        </div>

        <div className="relative w-full aspect-[9/16] rounded-lg overflow-hidden bg-gray-900">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&controls=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`} 
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
