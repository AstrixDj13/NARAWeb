import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { useRef } from "react";
import classes from "./imageGallery.module.css";
import ImageWithSkeleton from "../utils/ImageWithSkeleton";

export default function ImageGallery({
  images,
  currentIndex,
  handleUp,
  handleDown,
  scrollToImage,
  imageRefs,
}) {
  const containerRef = useRef(null);

  return (
    <div className="flex w-full  gap-2 lg:w-[50%]   h-[460px] md:h-[790px]  xl:h-[calc(100vh-90px)] ">
      {/* Image Side Pane */}
      <div className="flex h-full  flex-col items-center gap-4 w-1/5 ">
        <div
          className={`h-full overflow-auto ${classes["hide-scrollbar"]}  lg:w-28 w-16 `}
        >
          {images?.map((el, index) => (
            // <div
            //   key={index}
            //   className=" mb-4 h-[102px] lg:h-[150px] cursor-pointer  flex items-center justify-center"
            // >
            //   <img title="image"
            //     src={el?.node?.src}
            //     className="cursor-pointer w-full h-full object-cover border-2"
            //     alt={`Image ${index + 1}`}
            //     onClick={() => scrollToImage(index)}
            //     onLoad={() => console.log("Image loaded")}
            //   />
            // </div>

            <div
              key={index}
              onClick={() => scrollToImage(index)}
              className=" mb-4 h-[102px] lg:h-[150px] cursor-pointer  flex items-center justify-center"
            >
              <ImageWithSkeleton img={el?.node?.src} name={index + 1} />
            </div>
          ))}
        </div>
        <div className="flex flex-col h-fit gap-2">
          <button
            onClick={handleUp}
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold border-2"
          >
            <FaChevronUp />
          </button>
          <button
            onClick={handleDown}
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold border-2"
          >
            <FaChevronDown />
          </button>
        </div>
      </div>
      <div
        className="xl:w-full xl:h-full w-full sm:w-[641px] h-[460px] md:h-[790px]  overflow-hidden"
        ref={containerRef}
      >
        {images?.map((el, index) => (
          <div
            key={el?.node?.src}
            className="w-full h-full"
            ref={(el) => (imageRefs.current[index] = el)}
          >
            <ImageWithSkeleton img={el?.node?.src} name={index + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
