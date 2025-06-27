import React, { useEffect, useState } from "react";
import TopSection from "../components/home/TopSection";
/*import Navbar from "../components/Navbar/Navbar";*/
import Navbar from "../components/Navbar/NavbarUpdated";
import BehindTheScreen from "../components/home/BehindTheScreen";
import CollectionCarousel from "../components/home/CollectionCarousel1";
import Spotlight from "../components/home/Spotlight";
import MidSection from "../components/home/MidSection";
import FooterSection from "../components/home/FooterSectionUpdated";
import TestimonialsSection from "../components/home/Testimonials";
import SubscribeSection from "../components/home/SubscribeSection";
import NewestArrivals from "../components/home/NewArrivals";
import { motion } from "framer-motion";

// Inline CSS for marquee animation
const marqueeStyle = `
@keyframes marquee {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
.marquee {
  display: inline-block;
  white-space: nowrap;
  animation: marquee 14s linear infinite;
}
.announcement-container {
  overflow: hidden;
  white-space: nowrap;
}
`;

// DiscountPopup component
const DiscountPopup = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 10000); // Show after 10 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!showPopup) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50 bg-white dark:!bg-black p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-xs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setShowPopup(false)}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Close popup"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <h3 className="font-bold text-lg text-gray-800 dark:!text-white mb-2">
        Special Discount!
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
        You are special! Use this code at checkout for 25% off your first
        purchase:
      </p>
      <div className="bg-[#D8E3B1] dark:bg-[#1F4A40] text-[#1F4A40] dark:text-[#D8E3B1] px-3 py-2 rounded font-mono font-bold text-center">
        SAVE25
      </div>
    </motion.div>
  );
};

const Home = () => {
  return (
    <div className="dark:bg-black">
      {/* Global marquee styles */}
      <style>{marqueeStyle}</style>

      {/* Announcement panel with floating text */}
      <div className="bg-black text-white font-bold">
        <div className="announcement-container py-1">
          <div className="marquee">Chaon : The Summer Edit 2025 LIVE NOW!</div>
        </div>
      </div>

      {/* Discount popup */}
      {/* <DiscountPopup /> */}

      <Navbar />
      <TopSection />
      <NewestArrivals />
      {/*<BehindTheScreen />*/}
      <CollectionCarousel />
      {/* <MidSection /> */}
      <Spotlight />
      {/* <MidSection /> */}
      {/*<SubscribeSection /> */}
      <TestimonialsSection />
      <FooterSection />
    </div>
  );
};

export default Home;
