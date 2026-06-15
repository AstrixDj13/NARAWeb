import React, { useEffect, useState } from "react";
import { getCollections } from "../../apis/Collections";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";
import { getActiveCampaigns } from "../../utils/campaignUtils";

const TopSection = () => {
  const [allCollections, setAllCollections] = useState([]);
  const [bannerCollection, setBannerCollection] = useState(null);
  const excludedTitles = [
    "C Grade Products",
    "UGC_Collection",
    "Men's Top",
    "Bestsellers",
    "Co-ord sets",
    "Saaz"
  ];

  const fetchCollections = async () => {
    try {
      let fetchedCollections = await getCollections();
      
      const aaina = fetchedCollections.find(c => c.title.trim().toUpperCase().includes("AAINA"));
      if (aaina) setBannerCollection(aaina);

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
        setTopMarginClass("mt-[11.5rem] sm:mt-[12rem] md:mt-[12.5rem] lg:mt-[12.5rem]");
        setBannerHeightClass("h-[calc(100vh-11.5rem)] sm:h-[calc(100vh-12rem)] md:h-[calc(100vh-12.5rem)] lg:h-[calc(100vh-12.5rem)]");
      } else if (hasMarquee) {
        setTopMarginClass("mt-[7.5rem] sm:mt-[8rem] md:mt-[8.5rem] lg:mt-[8.5rem]");
        setBannerHeightClass("h-[calc(100vh-7.5rem)] sm:h-[calc(100vh-8rem)] md:h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-8.5rem)]");
      } else if (hasCountdown) {
        setTopMarginClass("mt-[10rem] sm:mt-[10.5rem] md:mt-[11rem] lg:mt-[11rem]");
        setBannerHeightClass("h-[calc(100vh-10rem)] sm:h-[calc(100vh-10.5rem)] md:h-[calc(100vh-11rem)] lg:h-[calc(100vh-11rem)]");
      } else {
        setTopMarginClass("mt-[6rem] sm:mt-[6.5rem] md:mt-[7rem] lg:mt-[7rem]");
        setBannerHeightClass("h-[calc(100vh-6rem)] sm:h-[calc(100vh-6.5rem)] md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-7rem)]");
      }
    } catch (err) {
      console.warn("TopSection campaign check err:", err);
    }
  }, []);

  return (
    <div className={`${topMarginClass} w-full bg-white dark:bg-black transition-all duration-300`}>
      {/* AAINA Banner */}
      {bannerCollection ? (
        <div className={`relative w-full ${bannerHeightClass} overflow-hidden mb-[2px]`}>
          <Link to={`/collection?id=${encodeURIComponent(bannerCollection.id)}`} className="w-full h-full block group">
            <img
              src={getOptimizedImageUrl(bannerCollection.imageSrc, 1200)}
              alt={bannerCollection.title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-14 md:left-14 flex flex-col items-start z-10">
              <h2 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-serif uppercase tracking-widest drop-shadow-lg mb-4 sm:mb-6">
                {bannerCollection.title}
              </h2>
              <button className="bg-white/90 hover:bg-white text-black px-6 py-3 sm:px-8 sm:py-4 font-mono font-bold text-sm sm:text-base uppercase tracking-[0.2em] transition-all duration-300">
                Shop Now
              </button>
            </div>
          </Link>
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
          const mobileUrl = getOptimizedImageUrl(collection.imageSrc, 600);
          const desktopUrl = getOptimizedImageUrl(collection.imageSrc, 800);

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
