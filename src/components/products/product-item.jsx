import { formatToINR } from "../global/convert-to-inr";

import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";
import Skeleton from "@mui/material/Skeleton";
import ViewButton from "../ViewButton";
import { useOfferTag } from "../../hooks/useOfferTag";

const ProductItem = ({
  colors,
  name,
  discount,
  message,
  price,
  img,
  productId,
  stockLeft,
}) => {
  const offerTag = useOfferTag(productId);
  console.log("Received stockLeft:", stockLeft);
  productId = encodeURIComponent(productId); //Bad code
  return (
    <Link to={`/product/${productId}?camefrompage=Products`}>
      <div className="flex flex-col justify-between h-full font-antikor tracking-tighter xl:w-[350px] md:w-[320px] w-full cursor-pointer hover:brightness-75">
        <div className="w-full md:h-[400px] h-[300px] lg:h-[477px] relative">
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
        </div>
        <div className="py-2 text-center md:text-left flex flex-col flex-grow">
          <h1 className="font-semibold py-2 line-clamp-2 md:line-clamp-none min-h-[3.5rem] md:min-h-0">{name}</h1>
          <div className="flex flex-col items-center justify-center">
            <div className="font-mono text-base">INR {formatToINR(price)}</div>
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
        <div className="mt-auto">
          <ViewButton link={`/product/${productId}?camefrompage=Products`} />
        </div>
      </div>
      {/* <div className="flex justify-between py-2">
          plus minus button
            <div className="flex text-xl items-center cursor-pointer gap-2">
              <div className="border w-8 h-8 grid place-items-center cursor-pointer" onClick={() => handleAddtocard("add")}><GoPlus /></div>
              <div>{productCount}</div>
              <div className="border w-8 h-8 grid place-items-center cursor-pointer" onClick={() => handleAddtocard("remove")}><GoDash /></div>
            </div>
            
            <div className="font-medium flex gap-1 items-center cursor-pointer" onClick={handleBookmark}>
                {bookmark ? (
                    <FaBookmark />
                ) : (
                    <FaRegBookmark />
                )}
                Wishlist
            </div>
        </div> */}
    </Link >
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
