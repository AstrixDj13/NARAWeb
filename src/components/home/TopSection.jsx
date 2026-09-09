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
      const newArrivals = fetchedCollections.find(c => c.title.trim().toUpperCase().includes("NEW ARRIVALS"));

      const banners = [];
      if (newArrivals) banners.push(newArrivals);
      if (bogo) banners.push(bogo);
      if (aaina) banners.push(aaina);
      setBannerCollections(banners);

      fetchedCollections = fetchedCollections.filter(
        (collection) => !excludedTitles.some(title => title.trim().toUpperCase() === collection.title.trim().toUpperCase())
      );

      let reversedCollections = fetchedCollections.reverse();

      const newArrivalsGrid = reversedCollections.find(c => c.title.trim().toUpperCase().includes("NEW ARRIVALS"));
      const tops = reversedCollections.find(c => c.title.trim().toUpperCase() === "TOPS");
      const bottoms = reversedCollections.find(c => c.title.trim().toUpperCase() === "BOTTOMS");

      const otherCollections = reversedCollections.filter(c =>
        !c.title.trim().toUpperCase().includes("NEW ARRIVALS") &&
        c.title.trim().toUpperCase() !== "TOPS" &&
        c.title.trim().toUpperCase() !== "BOTTOMS"
      );

      const orderedCollections = [];
      if (newArrivalsGrid) orderedCollections.push(newArrivalsGrid);
      if (tops) orderedCollections.push(tops);
      if (bottoms) orderedCollections.push(bottoms);
      orderedCollections.push(...otherCollections);

      setAllCollections(orderedCollections);
    } catch (error) {
      console.error(error);
    }
  };

  const [topMarginClass, setTopMarginClass] = useState("mt-[5rem] md:mt-[7rem]");
  const [bannerHeightClass, setBannerHeightClass] = useState("h-[calc(100vh-5rem)] md:h-[calc(100vh-7rem)]");

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
        setTopMarginClass("mt-[10.5rem] md:mt-[12.5rem]");
        setBannerHeightClass("h-[calc(100vh-10.5rem)] md:h-[calc(100vh-12.5rem)]");
      } else if (hasMarquee) {
        setTopMarginClass("mt-[6.5rem] md:mt-[8.5rem]");
        setBannerHeightClass("h-[calc(100vh-6.5rem)] md:h-[calc(100vh-8.5rem)]");
      } else if (hasCountdown) {
        setTopMarginClass("mt-[9rem] md:mt-[11rem]");
        setBannerHeightClass("h-[calc(100vh-9rem)] md:h-[calc(100vh-11rem)]");
      } else {
        setTopMarginClass("mt-[5rem] md:mt-[7rem]");
        setBannerHeightClass("h-[calc(100vh-5rem)] md:h-[calc(100vh-7rem)]");
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

  const tileTilts = [
    "rotate-0",
    "rotate-[1.2deg]",
    "rotate-[-1deg]",
    "rotate-[1deg]",
    "rotate-[-1.6deg]",
    "rotate-[1.5deg]",
    "rotate-[-1deg]",
  ];

  return (
    <div className={`${topMarginClass} w-full bg-transparent transition-all duration-300`}>
      {/* Top Banners Carousel */}
      {bannerCollections.length > 0 ? (
        <div className={`grain-overlay relative w-full ${bannerHeightClass} overflow-hidden mb-6`}>
          {bannerCollections.map((banner, index) => (
            <Link
              key={banner.id}
              to={`/collection?id=${encodeURIComponent(banner.id)}`}
              className={`absolute inset-0 w-full h-full block group transition-opacity duration-1000 ease-in-out ${index === currentBannerIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
            >
              {/* Desktop Banner Image */}
              <img
                src={getOptimizedImageUrl(banner.imageSrc, 1200)}
                alt={banner.title}
                className={`w-full h-full object-cover object-top grayscale-[35%] contrast-[1.08] transition-[filter,transform] duration-[1200ms] group-hover:grayscale-0 group-hover:scale-105 ${banner.mobileImageSrc ? 'hidden lg:block' : ''}`}
              />
              {/* Mobile Banner Image */}
              {banner.mobileImageSrc && (
                <img
                  src={getOptimizedImageUrl(banner.mobileImageSrc, 800)}
                  alt={`${banner.title} Mobile`}
                  className="w-full h-full object-cover object-top grayscale-[35%] contrast-[1.08] transition-[filter,transform] duration-[1200ms] group-hover:grayscale-0 group-hover:scale-105 lg:hidden block"
                />
              )}
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/70 transition-colors duration-500"></div>

              <div className="absolute bottom-8 left-6 sm:bottom-12 sm:left-12 md:bottom-16 md:left-16 flex flex-col items-start z-10 -rotate-2 origin-bottom-left">
                {!banner.title.toUpperCase().includes("BUY 1 GET 1") && (
                  <h2 className="font-slussen text-white text-4xl sm:text-6xl md:text-8xl font-extrabold uppercase tracking-tighter drop-shadow-2xl mb-6">
                    {banner.title}
                  </h2>
                )}
                {/* Ticket-shaped CTA */}
                <button className="group/btn relative inline-flex items-center bg-white pl-7 pr-6 py-3.5 text-xs font-['Antikor_Mono'] font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#D8E3B1] [clip-path:polygon(0%_50%,14px_0%,100%_0%,100%_100%,14px_100%)]">
                  <span className="absolute left-[7px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-black group-hover/btn:bg-[#1F4A40]"></span>
                  Shop Now
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover/btn:translate-x-2">→</span>
                </button>
              </div>
            </Link>
          ))}

          {/* Numbered slide tabs */}
          {bannerCollections.length > 1 && (
            <div className="absolute bottom-6 right-6 sm:right-10 flex items-end gap-4 z-20 font-['Antikor_Mono']">
              {bannerCollections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`text-xs sm:text-sm tracking-widest transition-all duration-300 ${idx === currentBannerIndex ? "text-white scale-110" : "text-white/40 hover:text-white/70"
                    }`}
                  aria-label={`Go to banner ${idx + 1}`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`relative w-full ${bannerHeightClass} overflow-hidden mb-6 md:rounded-b-[3rem]`}>
          <img
            src="/mystery.jpeg"
            alt="Mystery Banner"
            className="w-full h-full object-cover object-top"
          />
        </div>
      )}

      {/* Collection ticker */}
      {allCollections.length > 0 && (
        <div className="relative w-full overflow-hidden bg-[#1F4A40] py-3 mb-8" role="presentation">
          <div className="flex w-max marquee-track">
            {[0, 1].map((rep) => (
              <div key={rep} className="flex items-center shrink-0">
                {allCollections.map((collection) => (
                  <span
                    key={`${rep}-${collection.id}`}
                    className="font-['Antikor_Mono'] text-[#D8E3B1] text-xs sm:text-sm uppercase tracking-[0.2em] whitespace-nowrap px-6"
                  >
                    {collection.title} <span className="text-white/40">✷</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:px-8 pb-12 bg-transparent max-w-[2000px] mx-auto">
        {allCollections.map((collection, index) => {
          const targetImageSrc = collection.mobileImageSrc || collection.imageSrc;
          const mobileUrl = getOptimizedImageUrl(targetImageSrc, 600);
          const desktopUrl = getOptimizedImageUrl(targetImageSrc, 800);
          const isPriority = index < 6;
          let displayName = collection.title;

          // Bento Box Dynamic Sizing
          let gridClasses = "col-span-1";
          if (allCollections.length === 3) {
            // Perfect 3-item Bento: Large hero on left, two stacked wide rectangles on right
            if (index === 0) gridClasses = "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-square";
            else gridClasses = "md:col-span-2 aspect-[4/5] md:aspect-[2/1]";
          } else {
            // Default robust layout
            if (index === 0) gridClasses = "md:col-span-2 md:row-span-2 aspect-[4/5] md:aspect-auto md:min-h-[600px]";
            else if (index === 3 || index === 6) gridClasses = "md:col-span-2 aspect-[4/5] md:aspect-[2/1]";
            else gridClasses = "col-span-1 aspect-[4/5] md:aspect-square";
          }

          return (
            <Link
              key={collection.id}
              to={`/collection?id=${encodeURIComponent(collection.id)}`}
              className={`${tileTilts[index % tileTilts.length]} hover:rotate-0 hover:z-20 relative group w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-900 block shadow-sm hover:shadow-2xl transition-all duration-500 ${gridClasses}`}
            >
              <div className="grain-overlay w-full h-full">
                <img
                  title={collection.title}
                  src={desktopUrl}
                  srcSet={`${mobileUrl} 600w, ${desktopUrl} 800w`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover grayscale-[30%] contrast-[1.08] transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
                  alt={collection.title}
                  fetchpriority={isPriority ? "high" : "auto"}
                  loading={isPriority ? "eager" : "lazy"}
                />
              </div>

              {/* Spinning Sticker Badge for the featured tile */}
              {index === 0 && (
                <div className="absolute top-6 right-6 z-20 pointer-events-none w-24 h-24 sm:w-28 sm:h-28">
                  <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#D8E3B1] drop-shadow-md">
                      <polygon points="50,5 63,20 83,17 80,37 95,50 80,63 83,83 63,80 50,95 37,80 17,83 20,63 5,50 20,37 17,17 37,20" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-['Antikor_Mono'] font-bold text-[#1F4A40] text-xs sm:text-[11px] uppercase tracking-[0.2em] -rotate-12 text-center leading-tight">Must<br />Have</span>
                  </div>
                </div>
              )}

              {/* Subtle legibility overlay */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>

              {/* Persistent sticker tag */}
              <span className="absolute left-3 bottom-3 z-20 bg-white dark:bg-[#1a1a1a] text-black dark:text-[#ffffff] font-['Antikor_Mono'] text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1.5 rotate-[-3deg] shadow-md border border-transparent dark:border-white/20">
                {displayName}
              </span>

              {/* Glassmorphism Hover Info Panel */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex flex-col justify-end h-full md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500 z-10">
                <div className="backdrop-blur-xl bg-white/30 dark:bg-black/40 border border-white/40 dark:border-white/10 p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex justify-between items-center shadow-lg">
                  <h2 className="text-black dark:text-white text-xl sm:text-2xl font-bold uppercase tracking-widest truncate mr-4">
                    {displayName}
                  </h2>
                  <div className="bg-black dark:bg-white text-white dark:text-black rounded-full min-w-[40px] h-10 flex items-center justify-center shadow-md -rotate-45 group-hover:rotate-0 transition-transform duration-500 flex-shrink-0">
                    <span className="text-xl leading-none mb-0.5">→</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TopSection;
