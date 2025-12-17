import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../../apis/Collections";

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

  const includedTitles = ["Tops", "Bottoms", "Co-ord sets"];

  const filteredCollections = allCollections.filter(
    (col) => includedTitles.includes(col.title));

  return (
    // Re-added px-4 for left/right padding of the entire carousel
    // Kept gap-0 so cards remain touching each other
    // Added flex-nowrap to ensure items don't wrap, enabling horizontal scroll
    <div className="collection-carousel-container w-full max-w-8xl mx-auto py-8">
      <div className="overflow-x-auto py-6 px-3 flex flex-nowrap gap-0 no-scrollbar">
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
          >
            <div className="relative w-full h-[500px] overflow-hidden shadow-md bg-white">
              <img
                src={col.imageSrc}
                alt={col.title}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-black dark:!text-white font-bold text-base tracking-wider uppercase">
                {col.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div >
  );
};

export default CollectionCarousel;