import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";

export default function WhatsAppButton() {
  const location = useLocation();
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    // Check if the current page is a single product page
    const isProductPage = location.pathname.startsWith("/product/") || location.pathname.startsWith("/products/");
    
    if (isProductPage) {
      // Delay to make it noticeable after page load
      const timer = setTimeout(() => {
        setShowBubble(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowBubble(false);
    }
  }, [location.pathname]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      {/* Bubble Popup */}
      <div 
        className={`bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2.5 pr-7 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-gray-100 dark:border-gray-700 relative text-sm w-[200px] transition-all duration-500 ease-in-out pointer-events-auto ${showBubble ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <p className="font-semibold text-[13px] leading-tight">Confused how to style it?</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 leading-tight">Ask our in-house stylists!</p>
        
        {/* Triangle pointer pointing down towards the WhatsApp icon */}
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-b border-r border-gray-100 dark:border-gray-700"></div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowBubble(false);
          }} 
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Close bubble"
        >
          <FaTimes size={12} />
        </button>
      </div>

      {/* WhatsApp Icon */}
      <a
        href="https://wa.me/919326472754"
        target="_blank"
        rel="noreferrer"
        className="text-[#25D366] drop-shadow-md hover:scale-110 hover:drop-shadow-lg transition-all duration-300 flex items-center justify-center pointer-events-auto"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="text-5xl md:text-6xl" />
      </a>
    </div>
  );
}
