import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Minimum swipe distance (in px) to trigger slide
  const minSwipeDistance = 20;

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

  const openPopup = (index) => {
    scrollToImage(index);
    setIsPopupOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = "";
  };

  // The Slider JSX (Used for mobile directly, and for desktop inside the popup modal)
  const renderSlider = (isDesktopPopup = false) => (
    <div
      ref={!isDesktopPopup ? containerRef : null}
      className="w-full h-full relative overflow-hidden bg-white dark:bg-black"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {images?.map((el, index) => (
        <div
          key={el?.node?.src || index}
          ref={!isDesktopPopup ? (el) => (imageRefs.current[index] = el) : null}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
        >
          {(index === currentIndex || index === currentIndex + 1 || index === currentIndex - 1) && (
            isMobile && !isDesktopPopup ? (
              <MobileZoomImage img={el?.node?.src} isPriority={index === 0} />
            ) : (
              <ZoomableImage img={el?.node?.src} active={index === currentIndex} isPriority={index === 0} />
            )
          )}
        </div>
      ))}

      {/* Invisible overlay for capturing touch events reliably on mobile */}
      {(isMobile || isDesktopPopup) && (
        <div
          className="absolute inset-0 z-[15] pointer-events-none"
        // We apply pointer-events none to let mouse interaction through for desktop zoom,
        // but we can't capture swipes easily if pointer-events is none.
        // On mobile MobileZoomImage might need touch events, but originally we had an invisible overlay blocking it?
        />
      )}
      {/* For mobile, use the original blocking div pattern if it was there */}
      {isMobile && !isDesktopPopup && (
        <div
          className="absolute inset-0 z-[15] cursor-zoom-in"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => openPopup(currentIndex)}
        />
      )}

      {/* Navigation Arrows */}
      {(!isMobile || isDesktopPopup) && images?.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); handleUp(); }}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-white/80 dark:bg-black/60 rounded-full flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-black text-black dark:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous image"
            disabled={currentIndex === 0}
          >
            <FaChevronLeft className="mr-1 lg:mr-0" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDown(); }}
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
              onClick={(e) => { e.stopPropagation(); scrollToImage(index); }}
              className={`h-2.5 rounded-full transition-all pointer-events-auto ${index === currentIndex ? "bg-black dark:bg-white w-6" : "bg-gray-400 dark:bg-gray-600 w-2.5"
                }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`relative w-full ${isMobile ? "flex aspect-[3/4]" : "grid grid-cols-2 gap-4 p-2 h-max"} lg:w-[50%]`}>
        {isMobile ? (
          renderSlider()
        ) : (
          images?.map((el, index) => (
            <div
              key={el?.node?.src || index}
              ref={(elem) => (imageRefs.current[index] = elem)}
              className="w-full aspect-[3/4] cursor-zoom-in relative overflow-hidden group bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-sm"
              onClick={() => openPopup(index)}
            >
              <img
                src={el?.node?.src}
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))
        )}
      </div>

      {/* Popup Slider */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center overflow-hidden h-screen w-screen text-white">
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md cursor-pointer"
            aria-label="Close popup"
          >
            <FaTimes size={24} />
          </button>

          <div className="w-[95vw] h-[90vh] md:w-[80vw] lg:h-[95vh] max-w-6xl rounded-lg overflow-hidden shadow-2xl relative bg-transparent flex justify-center items-center">
            <div className="w-full h-full max-h-full max-w-full relative flex items-center justify-center">
              {renderSlider(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
