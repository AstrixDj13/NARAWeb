// src/components/home/CollectionCarousel.jsx

import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { getCollections } from "../../apis/Collections";

const collections = [
  {
    name: "Tops",
    image: "https://cdn.shopify.com/s/files/1/0722/8951/7782/files/TheJuneCo-ordset-1stpic-min.webp?v=1728406041",
    link: "/collection/tops",
  },
  {
    name: "Staples",
    image: "https://cdn.shopify.com/s/files/1/0722/8951/7782/files/TheJuneCo-ordset-1stpic-min.webp?v=1728406041",
    link: "/collection/staples",
  },
  {
    name: "Dresses",
    image: "https://cdn.shopify.com/s/files/1/0722/8951/7782/files/TheJuneCo-ordset-1stpic-min.webp?v=1728406041",
    link: "/collection/dresses",
  },
  { // Added more items for demonstration of scrolling
    name: "Co-ords",
    image: "https://cdn.shopify.com/s/files/1/0722/8951/7782/files/TheJuneCo-ordset-1stpic-min.webp?v=1728406041",
    link: "/collection/coords",
  },
  {
    name: "Bottoms",
    image: "https://cdn.shopify.com/s/files/1/0722/8951/7782/files/TheJuneCo-ordset-1stpic-min.webp?v=1728406041",
    link: "/collection/bottoms",
  },
  {
    name: "Accessories",
    image: "https://cdn.shopify.com/s/files/1/0722/8951/7782/files/TheJuneCo-ordset-1stpic-min.webp?v=1728406041",
    link: "/collection/accessories",
  },
];

const CollectionCarousel = () => {

    const [allCollections, setAllCollections] = useState([]);
  
    const fetchCollections = async () => {
        try {
          const allCollections = await getCollections();
          console.log(allCollections);
          setAllCollections(allCollections.reverse());
        } catch (error) {
          console.error(error);
        }
      };
  
    useEffect(() => {
      fetchCollections();
    }, []); 

    const excludedTitles = ["Chaon: The Summer Edit 2025", "Bestsellers"];
    const filteredCollections = allCollections.filter(
      (col) => !excludedTitles.includes(col.title));
    
  return (
    // Re-added px-4 for left/right padding of the entire carousel
    // Kept gap-0 so cards remain touching each other
    // Added flex-nowrap to ensure items don't wrap, enabling horizontal scroll
    
    <div className="overflow-x-auto py-6 px-4 flex flex-nowrap gap-0 no-scrollbar">
      {filteredCollections.map((col, idx) => (
        <Link
          to={
            allCollections.length === 0
              ? "#"
              : `/collection?id=${encodeURIComponent(col.id)}`
            }
          key={idx}
          // Enforce a width that is 1/3 of the parent's width, accounting for padding/gaps if any
          // For exactly 3 to show, each item should be approx w-1/3 or slightly less
          // On small screens, we might want 1 or 2 to show
          // Using min-w-[33.33%] to ensure they fill 1/3 of space
          // Increased min-h to make cards larger vertically
          className="flex-none w-full sm:w-1/2 lg:w-1/3 transform transition-transform hover:scale-105"
          // Using min-w-full on small, min-w-1/2 on sm, and min-w-1/3 on lg ensures responsiveness
          // If you strictly want 3 items always, even on small screens, you could use 'min-w-[33.33%]' directly.
          // However, for typical mobile experience, showing 1 or 2 at a time is better.
          // I've used w-full, sm:w-1/2, lg:w-1/3 which should give:
          // Mobile: 1 card visible (full width)
          // Tablet (sm breakpoint): 2 cards visible (half width each)
          // Desktop (lg breakpoint): 3 cards visible (one-third width each)
        >
          {/* Increased h-80 to h-96 for a taller image area */}
          <div className="relative w-full h-96 overflow-hidden shadow-md bg-white">
            <LazyLoadImage
              effect="opacity"
              src={col.imageSrc}
              alt={col.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="mt-2 text-center">
            <span className="text-black dark:text-white font-bold text-base tracking-wider uppercase">
              {col.title}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CollectionCarousel;