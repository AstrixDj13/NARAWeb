import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { getProductByHandle, getProductById } from "../../apis/Products";
import ActionButtons from "./ActionButtons";
import VariantsController from "./VariantsController";
import Spinner from "../utils/Spinner";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const QuickViewModal = ({ isOpen, anchorRect, productId, handle, onMouseEnter, onMouseLeave }) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setProduct(null);
    setCurrentIndex(0);

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        let fetchedProduct;
        if (handle) {
          fetchedProduct = await getProductByHandle(handle);
        } else if (productId) {
          const numericId =
            typeof productId === "string" && productId.includes("/")
              ? productId.split("/").pop()
              : productId;
          fetchedProduct = await getProductById(numericId);
        }
        setProduct(fetchedProduct);
      } catch (err) {
        console.error("Quick view fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [isOpen, productId, handle]);

  const scrollToImageBySrc = useCallback(
    (src) => {
      if (!product?.images?.edges) return;
      const idx = product.images.edges.findIndex((e) => e.node.src === src || e.node.url === src);
      if (idx !== -1) setCurrentIndex(idx);
    },
    [product]
  );

  const images = product?.images?.edges || [];
  const currentImg = images[currentIndex]?.node?.src || images[currentIndex]?.node?.url;

  if (!isOpen || !anchorRect) return null;

  const popupWidth = 300;
  const popupHeight = 440;
  const margin = 12;
  const isMobile = window.innerWidth < 768;

  let left, top, transform;

  if (isMobile) {
    left = '50%';
    top = '50%';
    transform = 'translate(-50%, -50%)';
  } else {
    left = anchorRect.left - popupWidth - margin;
    if (left < 8) left = anchorRect.right + margin; 

    top = anchorRect.bottom - popupHeight;
    if (top < 8) top = 8;
    if (top + popupHeight > window.innerHeight - 8) top = window.innerHeight - popupHeight - 8;
    transform = 'none';
  }

  return ReactDOM.createPortal(
    <>
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-[99998]" 
          onClick={onMouseLeave}
        />
      )}
      <div
        style={{ position: "fixed", top, left, transform, width: popupWidth, zIndex: 99999 }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white dark:bg-[#111] rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-gray-200 dark:border-gray-700 flex flex-col relative"
          style={{ width: popupWidth, maxHeight: popupHeight }}>
          
          {isMobile && (
            <button 
              onClick={onMouseLeave}
              className="absolute top-2 right-2 z-50 bg-black/50 text-white rounded-full p-1.5 shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          )}

        {/* Image */}
        <div className="relative w-full bg-gray-100 dark:bg-black flex-shrink-0" style={{ height: 200 }}>
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner />
            </div>
          ) : currentImg ? (
            <img
              src={currentImg}
              alt={product?.title || "product"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
          )}

          {/* Nav arrows */}
          {images.length > 1 && !isLoading && (
            <>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-1.5 shadow hover:bg-white transition disabled:opacity-30"
              >
                <FaChevronLeft size={10} />
              </button>
              <button
                disabled={currentIndex === images.length - 1}
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-black rounded-full p-1.5 shadow hover:bg-white transition disabled:opacity-30"
              >
                <FaChevronRight size={10} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`rounded-full transition-all ${i === currentIndex ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        {!isLoading && product && (
          <div className="flex flex-col gap-3 p-4 overflow-y-auto text-black dark:text-white bg-white dark:bg-[#111]">
            {/* Title & Price */}
            <div>
              <h2 className="font-black text-base leading-tight line-clamp-2 text-black dark:text-white">
                {product.title}
              </h2>
              <p className="text-sm font-semibold mt-1 text-black dark:text-white">
                {product?.priceRange?.minVariantPrice?.currencyCode === 'INR' ? '₹' : (product?.priceRange?.minVariantPrice?.currencyCode || '₹')}
                {parseFloat(product?.priceRange?.minVariantPrice?.amount || 0).toFixed(2)}
              </p>
            </div>

            {/* Variants */}
            <div className="text-sm text-black dark:text-white">
              <VariantsController
                scrollToImageBySrc={scrollToImageBySrc}
                colorsArray={product.colorsArray || []}
                options={product.options || []}
                variants={product.variants}
                productId={product.id}
              />
            </div>

            {/* Buttons */}
            <div className="w-full">
              <ActionButtons inline productId={product.id} />
            </div>
          </div>
        )}
      </div>
    </div>
    </>,
    document.body
  );
};

export default QuickViewModal;
