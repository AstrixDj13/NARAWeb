import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProductsinCart, setTotalQuantityInCart } from "../../store";
import { updateLineItem, removeCartLine } from "../../apis/Cart";
import { Skeleton } from "@mui/material";
import { toast } from "sonner";

export default function CartItem({
  src,
  title,
  quantity,
  size,
  pricePerItem,
  cartLineId,
  cartId,
  productId,
}) {
  // State
  const [productQuantity, setProductQuantity] = useState();
  const [quantityUpdating, setQuantityUpdating] = useState(false);
  const [productIsUpdating, setProductIsUpdating] = useState(false);

  // Redux state and dispatch
  const totalQuantityInCart = useSelector((state) => state.cart.totalQuantity);
  const productsInCart = useSelector((state) => state.cart.productsInCart);
  const dispatch = useDispatch();

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
      removeProductFromCart(cartId, cartLineId);
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
        removeProductFromCart(cartId, cartLineId);
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

  // Render
  return (
    <div className="flex gap-2 z-100 sm:h-32 h-24 pb-2 border-b-2 dark:bg-black dark:text-white">
      {productIsUpdating ? (
        <Skeleton
          variant="rectangular"
          className="w-full h-auto p-3 dark:bg-white"
        />
      ) : (
        <>
          <div className="flex w-1/3">
            <img
              title="image"
              src={src}
              alt="Product"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex sm:gap-4 sm:gap-2 items-start w-2/3">
            <div className="flex flex-col justify-between h-full sm:gap-2 sm:text-base text-sm w-5/6">
              <div className="flex flex-col gap-2">
                <h1 className="font-bold w-full overflow-hidden text-ellipsis line-clamp-2">
                  {title}
                </h1>
                <p className="text-xs sm:text-base">
                  {pricePerItem?.currencyCode}{" "}
                  <strong className="font-black">
                    {(pricePerItem?.amount * 1.0 * productQuantity).toFixed(2)}
                  </strong>{" "}
                  | Size: <strong className="font-bold">{size}</strong>
                </p>
              </div>

              <div className="text-xs sm:text-base flex flex-row gap-2">
                <button
                  className="disabled:text-gray-400 px-2 bg-[#F7F7F7] border-1 dark:bg-black dark:text-white"
                  onClick={increaseQuantityHandler}
                  disabled={quantityUpdating}
                >
                  +
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
                  onClick={decreaseQuantityHandler}
                  disabled={quantityUpdating}
                >
                  &mdash;
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
  );
}
