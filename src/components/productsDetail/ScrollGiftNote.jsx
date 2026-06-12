import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const ScrollGiftNote = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if previously dismissed in this session
    if (sessionStorage.getItem('lucky10_dismissed')) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      if (isDismissed) return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      // If page is too short, avoid showing
      if (scrollHeight <= clientHeight * 1.5) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      
      if (scrollPercent >= 75) {
        setIsVisible(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check in case user is already scrolled
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleCopy = () => {
    navigator.clipboard.writeText("LUCKY10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsDismissed(true);
      sessionStorage.setItem('lucky10_dismissed', 'true');
    }, 700); // Wait for exit animation
  };

  if (isDismissed) return null;

  return (
    <div 
      className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9999] w-[260px] md:w-[280px] font-antikor transition-all duration-700 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 rotate-[-3deg]' : 'translate-y-12 opacity-0 rotate-0 pointer-events-none'
      }`}
    >
      {/* Sticky Note Container */}
      <div 
        className="bg-[#fcf59b] text-[#1F4A40] p-6 relative"
        style={{
          boxShadow: "2px 4px 8px rgba(0,0,0,0.2), inset 0 -3px 10px rgba(0,0,0,0.05)",
          borderBottomRightRadius: "30px 10px",
          borderBottomLeftRadius: "2px",
          borderTopRightRadius: "2px",
          borderTopLeftRadius: "2px"
        }}
      >
        {/* Fake tape at the top */}
        <div 
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-5 bg-white/40 shadow-sm -rotate-2"
          style={{ clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)" }}
        ></div>

        <button 
          onClick={handleDismiss} 
          className="absolute top-2 right-2 text-[#1F4A40]/60 hover:text-[#1F4A40] transition-colors z-10"
          aria-label="Close"
        >
           <IoClose size={20} />
        </button>
        
        <div className="relative z-10 mt-2">
          <p className="text-[15px] leading-relaxed mb-4 font-medium">
            Since you have scrolled this far, here's a little gift from our side - Use <strong className="font-bold underline text-lg tracking-wider block mt-1 text-center">LUCKY10</strong> coupon code to get Flat 10% off on your order.
          </p>
          <button 
            onClick={handleCopy}
            className={`w-full py-2 border-2 border-[#1F4A40] font-bold transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide ${
              copied 
              ? "bg-[#1F4A40] text-[#fcf59b]" 
              : "bg-transparent text-[#1F4A40] hover:bg-[#1F4A40]/10"
            }`}
          >
            {copied ? "✓ Copied" : "Copy Code"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScrollGiftNote;
