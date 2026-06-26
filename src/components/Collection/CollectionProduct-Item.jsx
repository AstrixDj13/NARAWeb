import { formatToINR } from "../global/convert-to-inr";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { Suspense, useEffect, useRef, useState } from "react";
import { GoPlus, GoDash } from "react-icons/go";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import ImageWithSkeleton from "../utils/ImageWithSkeleton";
import { useOfferTag } from "../../hooks/useOfferTag";
import { IoCartOutline } from "react-icons/io5";
import QuickViewModal from "../productsDetail/QuickViewModal";

const CollectionProductItem = ({
  colors,
  setActiveProductColor,
  name,
  discount,
  message,
  price,
  img,
  productId,
  handle,
  collectionTitle,
  collectionId,
  stockLeft,
}) => {
  const offerTag = useOfferTag(productId);
  const numericProductId = productId ? decodeURIComponent(productId).split('/').pop() : '';
  const numericCollectionId = collectionId ? decodeURIComponent(collectionId).split('/').pop() : '';
  const navigate = useNavigate();
  const [bookmark, setBookmark] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const iconRef = useRef(null);

  const handleBookmark = () => {
    setBookmark(!bookmark);
    if (bookmark) {
      toast.success("Product removed from your whishlist");
    } else {
      toast.success("Product added to your whishlist");
    }
  };

  const handleAddtocard = (action) => {
    if (action === "add") {
      setProductCount(productCount + 1);
      toast.success("Product added to cart");
    } else {
      if (productCount > 0) {
        setProductCount(productCount - 1);
        toast.success("Product removed from cart");
      }
    }
  };

  useEffect(() => {
    console.log("Logging information: ", collectionTitle, collectionId);
  }, []);

  const productClickHandler = () => {
    // const encodedProductId = encodeURIComponent(productId);
    // navigate(`/product/${encodedProductId}`);
  };

  const openQuickView = () => {
    if (iconRef.current) {
      setAnchorRect(iconRef.current.getBoundingClientRect());
    }
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    const timeout = setTimeout(() => {
      setIsQuickViewOpen(false);
    }, 200);
    setHoverTimeout(timeout);
  };

  return (
    <Link
      to={handle ? `/products/${handle}?camefrompage=collection&title=${encodeURIComponent(collectionTitle)}&id=${numericCollectionId}` : `/product/${numericProductId}?camefrompage=collection&title=${encodeURIComponent(collectionTitle)}&id=${numericCollectionId}`}
      state={{ imageSrc: img }}
    >
      <div
        className="flex flex-col h-full font-sans tracking-tighter w-full cursor-pointer hover:brightness-75 group relative"
        onClick={productClickHandler}
      >
        <div className="w-full aspect-[4/5] relative">
          <ImageWithSkeleton img={img} name={name} />
          {offerTag && (
            <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 z-10">
              {offerTag}
            </div>
          )}
          {name && name.toLowerCase().includes("axis jacket") && (
            <div className="absolute -top-1 right-6 z-10 animate-tag-swing flex flex-col items-center pointer-events-none">
              {/* String */}
              <div className="w-[1.5px] h-5 bg-amber-800/80"></div>
              {/* Tag body */}
              <div className="bg-black text-[#f2f2f2] px-1.5 py-2.5 rounded-sm relative shadow-xl border border-gray-800 mt-[-1px]">
                {/* Hole */}
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute -top-1 left-1/2 -translate-x-1/2 shadow-inner"></div>
                {/* Text */}
                <div style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }} className="uppercase tracking-[0.25em] text-[9px] font-bold text-center mt-0.5">
                  NARA's Pick
                </div>
              </div>
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
              className="bg-white/90 text-black p-2 rounded-full shadow-lg opacity-30 md:group-hover:opacity-100 transition-all duration-200 hover:bg-white flex items-center justify-center cursor-default scale-90 group-hover:scale-100"
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
          <h1 className="font-semibold py-2 line-clamp-2 md:line-clamp-none min-h-[3.5rem] md:min-h-0">{name}</h1>
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
              {colors.map((color, index) => (
                <ProductColor key={index} color={color} active={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CollectionProductItem;

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

// function ImageWithSkeleton({ img, name }) {
//   const [loadingImage, setLoadingImage] = useState(true);

//   return (

// <Box sx={{ width: '100%', height: '100%' }}>
//       {loadingImage && (
//         <Skeleton
//           variant="rectangular"
//           width="100%"
//           height="100%"
//           sx={{ bgcolor: 'grey.300' }}
//         />
//       )}
//       <img title="image"
//         src={img}
//         alt={`product-model-${name}`}
//         className={`${loadingImage? "opacity-0": "opacity-100"} w-full h-full object-cover `}
//         onLoad={() => setLoadingImage(false)}

//       />
//     </Box>

//   );
// }
