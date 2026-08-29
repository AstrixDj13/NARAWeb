import React, { useEffect, useState } from "react";
import { getCollections } from "../../apis/Collections";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { getActiveCampaigns } from "../../utils/campaignUtils";

const TopSection = () => {
  const [allCollections, setAllCollections] = useState([]);
  const [bannerCollections, setBannerCollections] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const excludedTitles = [
    "C Grade Products",
    "UGC_Collection",
    "Men's Top",
    "Bestsellers",
    "Co-ord sets",
    "Saaz",
    "BUY 1 GET 1 FREE"
  ];

  const fetchCollections = async () => {
    try {
      let fetchedCollections = await getCollections();

      const aaina = fetchedCollections.find(c => c.title.trim().toUpperCase().includes("AAINA"));
      const bogo = fetchedCollections.find(c => c.title.trim().toUpperCase() === "BUY 1 GET 1 FREE");
      
      const banners = [];
      if (bogo) banners.push(bogo);
      if (aaina) banners.push(aaina);
      setBannerCollections(banners);

      fetchedCollections = fetchedCollections.filter(
        (collection) => !excludedTitles.some(title => title.trim().toUpperCase() === collection.title.trim().toUpperCase())
      );

      let reversedCollections = fetchedCollections.reverse();

      const tops = reversedCollections.find(c => c.title.trim().toUpperCase() === "TOPS");
      const bottoms = reversedCollections.find(c => c.title.trim().toUpperCase() === "BOTTOMS");

      const otherCollections = reversedCollections.filter(c =>
        c.title.trim().toUpperCase() !== "TOPS" &&
        c.title.trim().toUpperCase() !== "BOTTOMS"
      );

      const orderedCollections = [];
      if (tops) orderedCollections.push(tops);
      if (bottoms) orderedCollections.push(bottoms);
      orderedCollections.push(...otherCollections);

      setAllCollections(orderedCollections);
    } catch (error) {
      console.error(error);
    }
  };

  const [topMarginClass, setTopMarginClass] = useState("mt-[7.5rem] sm:mt-[8rem] md:mt-[8.5rem] lg:mt-[8.5rem]");
  const [bannerHeightClass, setBannerHeightClass] = useState("h-[calc(100vh-7.5rem)] sm:h-[calc(100vh-8rem)] md:h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-8.5rem)]");

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    // Calculate exact header height padding dynamically based on active campaign components.
    // The heights are derived from Marquee (1.5rem), Ticker (3rem), Countdown (2.5rem), and Navbar thickness.
    // This permanently prevents any white gaps or crop overlapping across all device sizes.
    try {
      const activeCampaigns = getActiveCampaigns();
      const hasMarquee = activeCampaigns.some((c) => c.marqueeMessage);
      const hasCountdown = activeCampaigns.some((c) => c.name || c.targetDate);

      if (hasMarquee && hasCountdown) {
        setTopMarginClass("mt-[13rem] sm:mt-[13rem] md:mt-[12.5rem] lg:mt-[12.5rem]");
        setBannerHeightClass("h-[calc(100vh-13rem)] sm:h-[calc(100vh-13rem)] md:h-[calc(100vh-12.5rem)] lg:h-[calc(100vh-12.5rem)]");
      } else if (hasMarquee) {
        setTopMarginClass("mt-[10.5rem] sm:mt-[10.5rem] md:mt-[8.5rem] lg:mt-[8.5rem]");
        setBannerHeightClass("h-[calc(100vh-10.5rem)] sm:h-[calc(100vh-10.5rem)] md:h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-8.5rem)]");
      } else if (hasCountdown) {
        setTopMarginClass("mt-[11.5rem] sm:mt-[11.5rem] md:mt-[11rem] lg:mt-[11rem]");
        setBannerHeightClass("h-[calc(100vh-11.5rem)] sm:h-[calc(100vh-11.5rem)] md:h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)]");
      } else {
        setTopMarginClass("mt-[9rem] sm:mt-[9rem] md:mt-[7rem] lg:mt-[7rem]");
        setBannerHeightClass("h-[calc(100vh-9rem)] sm:h-[calc(100vh-9rem)] md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-7rem)]");
      }
    } catch (err) {
      console.warn("TopSection campaign check err:", err);
    }
  }, []);

  useEffect(() => {
    if (bannerCollections.length > 1) {
      const currentBanner = bannerCollections[currentBannerIndex];
      const title = currentBanner?.title?.trim().toUpperCase() || "";
      
      let delay = 5000;
      if (title.includes("AAINA")) {
        delay = 4000;
      } else if (title.includes("BUY 1 GET 1")) {
        delay = 5000;
      }

      const timeoutId = setTimeout(() => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerCollections.length);
      }, delay);
      
      return () => clearTimeout(timeoutId);
    }
  }, [bannerCollections, currentBannerIndex]);

  return (
    <div className={`${topMarginClass} w-full bg-white dark:bg-black transition-all duration-300`}>
      {/* Top Banners Carousel */}
      {bannerCollections.length > 0 ? (
        <div className={`relative w-full ${bannerHeightClass} overflow-hidden mb-[2px]`}>
          {bannerCollections.map((banner, index) => (
            <Link
              key={banner.id}
              to={`/collection?id=${encodeURIComponent(banner.id)}`}
              className={`absolute inset-0 w-full h-full block group transition-opacity duration-1000 ease-in-out ${
                index === currentBannerIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Desktop Banner Image */}
              <img
                src={getOptimizedImageUrl(banner.imageSrc, 1200)}
                alt={banner.title}
                className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 ${banner.mobileImageSrc ? 'hidden lg:block' : ''}`}
              />
              {/* Mobile Banner Image (if available) */}
              {banner.mobileImageSrc && (
                <img
                  src={getOptimizedImageUrl(banner.mobileImageSrc, 800)}
                  alt={`${banner.title} Mobile`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 lg:hidden block"
                />
              )}
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-14 md:left-14 flex flex-col items-start z-10">
                {!banner.title.toUpperCase().includes("BUY 1 GET 1") && (
                  <h2 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif uppercase tracking-widest drop-shadow-lg mb-4 sm:mb-6">
                    {banner.title}
                  </h2>
                )}
                <button className="bg-white/90 hover:bg-white text-black px-6 py-3 sm:px-8 sm:py-4 font-mono font-bold text-sm sm:text-base uppercase tracking-[0.2em] transition-all duration-300">
                  Shop Now
                </button>
              </div>
            </Link>
          ))}

          {/* Carousel Indicators */}
          {bannerCollections.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {bannerCollections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    idx === currentBannerIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to banner ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`relative w-full ${bannerHeightClass} overflow-hidden mb-[2px]`}>
          <img
            src="/mystery.jpeg"
            alt="Mystery Banner"
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
        {allCollections.map((collection, index) => {
          const targetImageSrc = collection.mobileImageSrc || collection.imageSrc;
          const mobileUrl = getOptimizedImageUrl(targetImageSrc, 600);
          const desktopUrl = getOptimizedImageUrl(targetImageSrc, 800);

          // Eagerly load the top 6 images which will be immediately visible
          const isPriority = index < 6;

          // Shorten specific titles if necessary for aesthetics
          let displayName = collection.title;
          //if (displayName === "Chaon: The Summer Edit 2025") {
          //  displayName = "SUMMER EDIT '25";
          //}

          return (
            <Link
              key={collection.id}
              to={`/collection?id=${encodeURIComponent(collection.id)}`}
              className="relative group w-full aspect-[4/5] md:aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 block"
            >
              <img
                title={collection.title}
                src={desktopUrl}
                srcSet={`${mobileUrl} 600w, ${desktopUrl} 800w`}
                sizes="(max-width: 768px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.80] group-hover:brightness-100"
                alt={collection.title}
                fetchpriority={isPriority ? "high" : "auto"}
                loading={isPriority ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 flex items-center justify-center p-4 cursor-pointer">
                <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-serif text-center uppercase tracking-widest drop-shadow-md">
                  {displayName}
                </h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TopSection;
