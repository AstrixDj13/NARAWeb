import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef, useState } from "react";
import classes from "./imageGallery.module.css";
import ImageWithSkeleton from "../utils/ImageWithSkeleton";
import ZoomableImage from "../utils/ZoomableImage";
import MobileZoomImage from "../utils/MobileZoomImage";

export default function ImageGallery({
  images,
  currentIndex,
  handleUp,
  handleDown,
  scrollToImage,
  imageRefs,
}) {
  const containerRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px) to trigger slide
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < (images?.length || 0) - 1) {
      handleDown(); // next image
    }
    if (isRightSwipe && currentIndex > 0) {
      handleUp(); // previous image
    }
  };

  return (
    <div className="relative flex w-full lg:w-[50%] h-[460px] md:h-[790px] xl:h-[calc(100vh-90px)]">
      {/* Main Image Slider */}
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden bg-white dark:bg-black"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images?.map((el, index) => (
          <div
            key={el?.node?.src}
            ref={(el) => (imageRefs.current[index] = el)}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
          >
            {isMobile ? (
              <MobileZoomImage img={el?.node?.src} isPriority={index === 0} />
            ) : (
              <ZoomableImage img={el?.node?.src} name={index + 1} active={index === currentIndex} isPriority={index === 0} />
            )}
          </div>
        ))}

        {/* Invisible overlay for capturing touch events reliably on mobile */}
        {isMobile && (
          <div
            className="absolute inset-0 z-[15]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />
        )}

        {/* Navigation Arrows */}
        {!isMobile && images?.length > 1 && (
          <>
            <button
              onClick={handleUp}
              className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white/80 dark:bg-black/60 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-black text-black dark:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous image"
              disabled={currentIndex === 0}
            >
              <FaChevronLeft className="mr-1 lg:mr-0" />
            </button>
            <button
              onClick={handleDown}
              className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white/80 dark:bg-black/60 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-black text-black dark:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next image"
              disabled={currentIndex === images.length - 1}
            >
              <FaChevronRight className="ml-1 lg:ml-0" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {images?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-none">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToImage(index)}
                className={`h-2.5 rounded-full transition-all pointer-events-auto ${index === currentIndex ? "bg-black dark:bg-white w-6" : "bg-gray-400 dark:bg-gray-600 w-2.5"
                  }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
