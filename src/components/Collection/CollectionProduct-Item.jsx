import { formatToINR } from "../global/convert-to-inr";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import { Suspense, useEffect, useState } from "react";
import { GoPlus, GoDash } from "react-icons/go";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import ImageWithSkeleton from "../utils/ImageWithSkeleton";
import ViewButton from "../ViewButton";

const CollectionProductItem = ({
  colors,
  setActiveProductColor,
  name,
  discount,
  message,
  price,
  img,
  productId,
  collectionTitle,
  collectionId,
}) => {
  productId = encodeURIComponent(productId); //Bad code
  const navigate = useNavigate();
  const [bookmark, setBookmark] = useState(false);
  const [addToCart, setAddToCart] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [loadingImage, setLoadingImage] = useState(true);

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

  return (
    <Link
      to={`/product/${productId}?camefrompage=collection&title=${collectionTitle}&id=${encodeURIComponent(
        collectionId
      )}`}
    >
      <div
        className="font-sans tracking-tighter xl:w-[23vw] lg:w-[30vw] md:w-[40vw] w-full cursor-pointer hover:brightness-75"
        onClick={productClickHandler}
      >
        <div className="w-full 2xl:h[700px]  md:h-[445px] h-[440px]  relative">
          <ImageWithSkeleton img={img} name={name} />

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
        <div className="py-2">
          <h1 className="font-semibold py-2">{name}</h1>
          <div className="flex justify-between items-center">
            <div className="font-mono text-base">INR {formatToINR(price)}</div>
            {colors && (
              <div className="flex items-center gap-2">
                {colors.map((color, index) => (
                  <ProductColor key={index} color={color} active={false} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between py-2">
          {/* plus minus button */}
          {/* <div className="flex text-xl items-center cursor-pointer gap-2">
              <div className="border w-8 h-8 grid place-items-center cursor-pointer" onClick={() => handleAddtocard("add")}><GoPlus /></div>
              <div>{productCount}</div>
              <div className="border w-8 h-8 grid place-items-center cursor-pointer" onClick={() => handleAddtocard("remove")}><GoDash /></div>
            </div> */}
          <ViewButton
            link={`/product/${productId}?camefrompage=collection&title=${collectionTitle}&id=${encodeURIComponent(
              collectionId
            )}`}
          />
          {/* Bookmark button */}
          {/* <div className="font-medium flex gap-1 items-center cursor-pointer" onClick={handleBookmark}>
                {bookmark ? (
                    <FaBookmark />
                ) : (
                    <FaRegBookmark />
                )}
                Wishlist
            </div> */}
        </div>
      </div>
    </Link>
  );
};

export default CollectionProductItem;

function ProductColor({ color, active }) {
  return (
    <div
      className={`w-6 aspect-square rounded-full grid place-items-center cursor-pointer ${
        active ? "border-2 border-gray-400" : "border-none"
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
