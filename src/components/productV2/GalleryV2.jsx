import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

// Shopify CDN images can be resized with ?width=
const sized = (src, width) => {
  if (!src) return src;
  if (!src.includes("cdn.shopify.com")) return src;
  return `${src}${src.includes("?") ? "&" : "?"}width=${width}`;
};

/**
 * Product gallery for the new product page.
 * - Phones: edge-to-edge swipe carousel (native scroll-snap) with a "1 / 6" counter.
 * - Desktop: two-column image grid.
 * - Tap / click any image: fullscreen viewer.
 * `activeIndex` lets the page jump to a variant's image (e.g. when a colour is picked).
 */
export default function GalleryV2({ images = [], title = "", activeIndex = 0 }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [viewerAt, setViewerAt] = useState(null);

  // Jump to the requested image (variant change)
  useEffect(() => {
    const el = trackRef.current;
    if (!el || activeIndex == null || activeIndex < 0) return;
    el.scrollTo({ left: activeIndex * el.clientWidth, behavior: "smooth" });
  }, [activeIndex]);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  useEffect(() => {
    if (viewerAt == null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setViewerAt(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [viewerAt]);

  if (!images.length) return <div className="w-full aspect-[4/5] bg-neutral-100 dark:bg-neutral-900" />;

  return (
    <>
      {/* Phones / tablets: swipe carousel */}
      <div className="relative lg:hidden">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setViewerAt(i)}
              className="relative shrink-0 w-full snap-center aspect-[4/5] bg-neutral-100 dark:bg-neutral-900"
              aria-label={`View image ${i + 1} of ${images.length} full screen`}
            >
              <img
                src={sized(src, 900)}
                srcSet={`${sized(src, 600)} 600w, ${sized(src, 900)} 900w, ${sized(src, 1200)} 1200w`}
                sizes="100vw"
                alt={`${title} - image ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchpriority={i === 0 ? "high" : undefined}
                draggable={false}
              />
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <span className="absolute bottom-3 right-3 bg-white/85 dark:bg-black/70 text-[11px] tracking-[0.15em] px-2 py-1 font-outfit">
              {index + 1} / {images.length}
            </span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/10">
              <div
                className="h-full bg-black dark:bg-white transition-all duration-300"
                style={{ width: `${100 / images.length}%`, transform: `translateX(${index * 100}%)` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Desktop: two-column grid */}
      <div className="hidden lg:grid grid-cols-2 gap-1">
        {images.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setViewerAt(i)}
            className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 overflow-hidden cursor-zoom-in"
            aria-label={`View image ${i + 1} full screen`}
          >
            <img
              src={sized(src, 1000)}
              alt={`${title} - image ${i + 1}`}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
              loading={i < 2 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {/* Fullscreen viewer: vertical scroll through all images */}
      {viewerAt != null &&
        createPortal(
          <div className="fixed inset-0 z-[300] bg-white dark:bg-black overflow-y-auto" role="dialog" aria-modal="true" aria-label={`${title} images`}>
            <button
              onClick={() => setViewerAt(null)}
              className="fixed top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/90 dark:bg-black/80 border border-black/10 flex items-center justify-center"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <div className="max-w-3xl mx-auto">
              {images.map((src, i) => (
                <img
                  key={src + i}
                  ref={(el) => i === viewerAt && el && el.scrollIntoView({ block: "start" })}
                  src={sized(src, 1600)}
                  alt={`${title} - image ${i + 1}`}
                  className="w-full h-auto block"
                />
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
