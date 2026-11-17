import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { pathname } = useLocation();
  // On product pages, sit above the fixed Add to Bag / Buy Now bar instead of covering it
  const isProductPage = /^\/products?\/[^/]+/.test(pathname);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'granted') {
      // If already granted in a previous session, grant it now as well
      if (window.fbq) {
        window.fbq('consent', 'grant');
      }
    } else if (consent === null) {
      // Show banner if no choice has been made
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'granted');
    if (window.fbq) {
      window.fbq('consent', 'grant');
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`fixed left-2 right-2 md:left-auto md:right-4 md:w-[440px] ${isProductPage ? "bottom-[76px]" : "bottom-2"} md:bottom-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl px-4 py-3 z-[120]`}
        >
          <div className="flex items-center gap-3">
            <p className="flex-1 text-xs leading-snug text-black dark:text-gray-200">
              We use cookies to improve your experience and show relevant ads.{" "}
              <a href="/privacy-policy" className="underline">Learn more</a>
            </p>
            <button
              onClick={handleDecline}
              className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-3 py-2 text-xs font-medium text-white bg-black hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100 rounded-lg transition-colors"
            >
              Accept
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
