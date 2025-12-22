import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useRef } from "react";
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

  return (
    <div className="flex w-full gap-2 lg:w-[50%] h-[460px] md:h-[790px] xl:h-[calc(100vh-90px)]">
      {/* Thumbnails */}
      <div className="flex h-full flex-col items-center gap-4 w-1/5">
        <div
          className={`h-full overflow-auto ${classes["hide-scrollbar"]} lg:w-28 w-16`}
        >
          {images?.map((el, index) => (
            <div
              key={index}
              onClick={() => scrollToImage(index)}
              className={`mb-4 h-[102px] lg:h-[150px] cursor-pointer border-2 ${index === currentIndex ? "border-black" : "border-transparent"
                }`}
            >
              <ImageWithSkeleton img={el?.node?.src} name={index + 1} />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleUp}
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
          >
            <FaChevronUp />
          </button>
          <button
            onClick={handleDown}
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
          >
            <FaChevronDown />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div
        ref={containerRef}
        className="xl:w-full xl:h-full w-full sm:w-[641px] h-[460px] md:h-[790px] overflow-hidden"
      >
        {images?.map((el, index) => (
          <div
            key={el?.node?.src}
            ref={(el) => (imageRefs.current[index] = el)}
            className="w-full h-full"
          >
            {index === currentIndex &&
              (isMobile ? (
                <MobileZoomImage img={el?.node?.src} />
              ) : (
                <ZoomableImage
                  img={el?.node?.src}
                  name={index + 1}
                  active
                />
              ))}
          </div>
        ))}
      </div>


    </div>
  );
}
