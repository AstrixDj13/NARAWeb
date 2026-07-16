import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProductsinCart, setTotalQuantityInCart } from "../../store";
import { updateLineItem, removeCartLine } from "../../apis/Cart";
import { Skeleton } from "@mui/material";
import { toast } from "sonner";
import { useEventTracker } from "../../hooks/EventTracker";
import RemoveSurveyModal from "./RemoveSurveyModal";
import { calculateCartPricing } from "../../utils/cartPricing";
export default function CartItem({
  src,
  title,
  quantity,
  size,
  pricePerItem,
  cartLineId,
  cartId,
  productId,
  stockLeft,
  isMelCollection,
  className,
}) {
  // State
  const [productQuantity, setProductQuantity] = useState();
  const [quantityUpdating, setQuantityUpdating] = useState(false);
  const [productIsUpdating, setProductIsUpdating] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // Redux state and dispatch
  const totalQuantityInCart = useSelector((state) => state.cart.totalQuantity);
  const productsInCart = useSelector((state) => state.cart.productsInCart);
  const dispatch = useDispatch();
  const { trackEvent } = useEventTracker();

  // Get pricing based on global cart items
  const { itemsPricing } = useMemo(() => calculateCartPricing(productsInCart), [productsInCart]);
  const pricing = itemsPricing?.[cartLineId];

  // Effect
  useEffect(() => {
    if (quantity) setProductQuantity(quantity);
  }, [quantity]);

  // Handlers
  const updateCartItem = async (
    cartId,
    cartLineId,
    quantity,
    totalQuantityInCart
  ) => {
    try {
      setQuantityUpdating(true);
      const updatedQuantity = await updateLineItem(
        cartId,
        cartLineId,
        productId,
        quantity
      );

      // Check stock availability
      if (productQuantity === updatedQuantity) {
        toast.info(
          `Only ${productQuantity} items are in stock for this variant!`
        );
        return;
      }

      // Update cart state
      const updatedProducts = productsInCart.map((el) =>
        el.node.id === cartLineId
          ? { node: { ...el.node, quantity: updatedQuantity } }
          : { node: el.node }
      );
      dispatch(setProductsinCart(updatedProducts));
      dispatch(
        setTotalQuantityInCart(
          totalQuantityInCart - productQuantity + updatedQuantity
        )
      );
    } catch (error) {
      console.error(error);
      if (error?.message?.includes("GraphQL error(s)")) {
        toast.error("Something went wrong");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(
          "Something went wrong! Please refresh the page or try again later!"
        );
      }
    } finally {
      setQuantityUpdating(false);
    }
  };

  const removeProductFromCart = async (cartId, cartLineId) => {
    try {
      setProductIsUpdating(true);
      const wasRemoved = await removeCartLine(cartId, cartLineId);
      if (!wasRemoved)
        throw new Error(
          "Could not remove product from the cart! Please try again after you refresh the page or later."
        );

      trackEvent('RemoveFromCart', {
        product_id: productId,
        product_name: title,
        price: pricePerItem?.amount,
        currency: pricePerItem?.currencyCode,
        quantity_removed: productQuantity,
        variant_size: size
      });

      const updatedProducts = productsInCart.filter(
        (el) => el.node.id !== cartLineId
      );
      dispatch(setProductsinCart(updatedProducts));
      dispatch(setTotalQuantityInCart(totalQuantityInCart - productQuantity));
    } catch (error) {
      if (error?.message?.includes("GraphQL error(s)")) {
        toast.error("Something went wrong");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(
          "Something went wrong! Please refresh the page or try again later!"
        );
      }
    } finally {
      setProductIsUpdating(false);
    }
  };

  const removeProductFromCartHandler = async () => {
    if (cartId && cartLineId) {
      setIsSurveyModalOpen(true);
    }
  };

  const increaseQuantityHandler = () => {
    if (cartId && cartLineId) {
      updateCartItem(
        cartId,
        cartLineId,
        productQuantity + 1,
        totalQuantityInCart
      );
    }
  };

  const decreaseQuantityHandler = () => {
    if (cartId && cartLineId) {
      if (productQuantity === 1) {
        setIsSurveyModalOpen(true);
      } else {
        updateCartItem(
          cartId,
          cartLineId,
          productQuantity - 1,
          totalQuantityInCart
        );
      }
    }
  };

  const handleSurveyConfirm = async (reason) => {
    try {
      if (reason) {
        const userId = localStorage.getItem("user_id") || undefined;
        const anonymousId = localStorage.getItem("anonymous_id") || undefined;

        const baseUrl = import.meta.env.VITE_EVENT_API_URL || "http://localhost:3001";
        const apiUrl = `${baseUrl}/api/removals`;
        
        await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId,
            productName: title,
            variantSize: size,
            reason,
            userId,
            anonymousId
          })
        });
      }
    } catch (e) {
      console.error("Failed to log removal reason:", e);
    } finally {
      setIsSurveyModalOpen(false);
      removeProductFromCart(cartId, cartLineId);
    }
  };

  // Render
  return (
    <>
      <RemoveSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        onConfirm={handleSurveyConfirm}
        productTitle={title}
      />
      <div className={`flex gap-2 z-100 pb-2 border-b-2 dark:bg-black dark:text-white ${className || "sm:h-32 h-24"}`}>
      {productIsUpdating ? (
        <Skeleton
          variant="rectangular"
          className="w-full h-auto p-3 dark:bg-white"
        />
      ) : (
        <>
          <div className="flex w-1/3 items-center justify-center">
            <img
              title="image"
              src={src}
              alt="Product"
              className="object-contain w-full h-full max-h-full"
            />
          </div>

          <div className="flex sm:gap-4 sm:gap-2 items-start w-2/3">
            <div className="flex flex-col justify-between h-full sm:gap-2 sm:text-base text-sm w-5/6">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold w-full overflow-hidden text-ellipsis line-clamp-2">
                  {title}
                </h1>
                <p className="text-xs sm:text-base flex flex-wrap items-center gap-1">
                  {pricePerItem?.currencyCode}{" "}
                  <span className="line-through text-gray-500 text-xs sm:text-xs mr-1">
                    {pricing ? pricing.totalStrikeoutPrice.toFixed(2) : (pricePerItem?.amount * 1.0 * productQuantity).toFixed(2)}
                  </span>
                  {pricing && pricing.totalEffectivePrice === 0 && pricing.totalStrikeoutPrice !== (pricing.originalPrice * productQuantity) && (
                    <span className="line-through text-gray-500 text-xs sm:text-xs mr-1">
                      {(pricing.originalPrice * productQuantity).toFixed(2)}
                    </span>
                  )}
                  <strong className="font-black">
                    {pricing ? (pricing.totalEffectivePrice === 0 ? "FREE" : pricing.totalEffectivePrice.toFixed(2)) : (pricePerItem?.amount * 1.0 * productQuantity).toFixed(2)}
                  </strong>{" "}
                  {pricing?.isMel && (
                    <span className="text-red-500 bg-red-100 px-1 py-0.5 rounded text-[10px] ml-1 font-bold whitespace-nowrap">
                      30% OFF
                    </span>
                  )}
                  | Size: <strong className="font-bold">{size}</strong>
                </p>
                {pricing?.isBogo && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="12" height="12" fill="currentColor"><path d="M13.7 5.3a2 2 0 0 0-.6-1.4l-3-3A2 2 0 0 0 8.7.3H2A1.5 1.5 0 0 0 .5 1.8v6.7c0 .4.2.8.5 1l6.7 6.7a2 2 0 0 0 2.8 0l3.2-3.1a2 2 0 0 0 0-2.9zM3.5 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                    BUY 1 GET 1 {pricing.freeCount > 0 ? `(-${pricePerItem?.currencyCode || '₹'}${(pricing.originalPrice * pricing.freeCount).toFixed(2)})` : ''}
                  </p>
                )}
                {stockLeft && (
                  <p className="text-red-500 text-xs font-bold mt-1">
                    {stockLeft}
                  </p>
                )}
              </div>

              <div className="text-xs sm:text-base flex flex-row gap-2">
                <button
                  className="disabled:text-gray-400 px-2 bg-[#F7F7F7] border-1 dark:bg-black dark:text-white"
                  onClick={decreaseQuantityHandler}
                  disabled={quantityUpdating}
                >
                  &mdash;
                </button>
                {quantityUpdating ? (
                  <Skeleton
                    variant="rectangular"
                    width="20px"
                    height="100%"
                    className="dark:bg-white"
                  />
                ) : (
                  <p className="w-[20px] flex items-center justify-center">
                    {productQuantity}
                  </p>
                )}
                <button
                  className="disabled:text-gray-400 px-2 bg-[#F7F7F7] border-1 dark:bg-black dark:text-white"
                  onClick={increaseQuantityHandler}
                  disabled={quantityUpdating}
                >
                  +
                </button>
              </div>
            </div>
            <button className="w-1/6" onClick={removeProductFromCartHandler}>
              <img title="image" src="/icons/deleteIcon.svg" alt="Remove" />
            </button>
          </div>
        </>
      )}
      </div>
    </>
  );
}
