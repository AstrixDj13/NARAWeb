import { formatToINR } from "../global/convert-to-inr";

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import { useOfferTag } from "../../hooks/useOfferTag";
import { IoCartOutline } from "react-icons/io5";
import QuickViewModal from "../productsDetail/QuickViewModal";

const ProductItem = ({
  colors,
  name,
  discount,
  message,
  price,
  img,
  productId,
  handle,
  stockLeft,
}) => {
  const offerTag = useOfferTag(productId);
  console.log("Received stockLeft:", stockLeft);
  const numericProductId = productId ? decodeURIComponent(productId).split('/').pop() : '';

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const iconRef = useRef(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const openQuickView = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (iconRef.current) {
      setAnchorRect(iconRef.current.getBoundingClientRect());
    }
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    const timeout = setTimeout(() => {
      setIsQuickViewOpen(false);
    }, 100);
    setHoverTimeout(timeout);
  };

  return (
    <Link
      to={handle ? `/products/${handle}?camefrompage=Products` : `/product/${numericProductId}?camefrompage=Products`}
      state={{ imageSrc: img }}
      className="flex flex-col justify-between h-full font-antikor tracking-tighter w-full cursor-pointer hover:brightness-75 group"
    >
      <div className="w-full aspect-[4/5] relative overflow-hidden group">
        <ImageWithSkeleton img={img} name={name} />
        {offerTag && (
          <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 z-10">
            {offerTag}
          </div>
        )}

        <div className="absolute w-full bottom-0">
          <div className="flex gap-2.5 p-3">
            {discount && (
              <div className="bg-white text-black font-medium px-2 cursor-default">
                {discount}% off
              </div>
            )}
            {message && (
              <div className="bg-white text-black font-medium px-2 cursor-default">
                {message}
              </div>
            )}
          </div>
        </div>

        <div
          ref={iconRef}
          onMouseEnter={openQuickView}
          onMouseLeave={closeQuickView}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openQuickView();
          }}
          className="absolute bottom-3 right-3 z-20"
        >
          <div
            className="bg-white/90 text-black p-2 rounded-full shadow-lg opacity-100 md:opacity-30 md:group-hover:opacity-100 transition-all duration-200 hover:bg-white flex items-center justify-center cursor-pointer scale-90 group-hover:scale-100"
            title="Quick View"
          >
            <IoCartOutline size={18} />
          </div>
        </div>

        <QuickViewModal
          isOpen={isQuickViewOpen}
          anchorRect={anchorRect}
          productId={productId}
          handle={handle}
          onMouseEnter={openQuickView}
          onMouseLeave={closeQuickView}
        />
      </div>
      <div className="py-2 text-center md:text-left flex flex-col flex-grow">
        <h1 className="font-semibold line-clamp-2 md:line-clamp-none">{name}</h1>
        <div className="flex flex-col items-center justify-center">
          <div className="font-mono text-sm flex justify-center items-center gap-1.5 mt-1">
            {offerTag === "30% Off" ? (
              <>
                <span className="line-through text-gray-400 text-xs">₹{formatToINR(price)}</span>
                <span className="font-medium">₹{formatToINR(price * 0.70)}</span>
              </>
            ) : (
              <span className="font-medium">₹{formatToINR(price)}</span>
            )}
          </div>
          {stockLeft !== undefined && stockLeft !== null && stockLeft !== "" && (
            <div className="text-xs text-red-600 mt-1">
              {stockLeft}
            </div>
          )}
        </div>
        {colors && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {colors?.map((color, index) => (
              <ProductColor key={index} color={color} active={false} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default React.memo(ProductItem);

function ProductColor({ color, active }) {
  return (
    <div
      className={`w-6 aspect-square rounded-full grid place-items-center cursor-pointer ${active ? "border-2 border-gray-400" : "border-none"
        }`}
    >
      <div
        className="w-4 aspect-square rounded-full"
        style={{ backgroundColor: color }}
      ></div>
    </div>
  );
}

function ImageWithSkeleton({ img, name }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
      )}
      <img
        src={img}
        alt={name}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-0" : "opacity-100"
          }`}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
