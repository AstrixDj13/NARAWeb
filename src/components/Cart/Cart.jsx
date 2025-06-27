import { useEffect, useRef, useCallback, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getItemsInCartAPI } from "../../apis/Cart";
import { Skeleton } from "@mui/material";

import { setCheckoutUrl, setProductsinCart } from "../../store";
import CartItem from "./CartItem";

export default function Cart({ toggleCartOpen, cartOpen }) {
  const totalQuantityInCart = useSelector((state) => state.cart.totalQuantity);
  const checkoutUrl = useSelector((state) => state.cart.checkoutUrl);
  const cartId = useSelector((state) => state.cart.id);
  const productsInCart = useSelector((state) => state.cart.productsInCart);
  const dispatch = useDispatch();

  const [cartLoading, setCartLoading] = useState(false);
  const [itemsQuantity, setItemsQuantity] = useState(0);

  const cartRef = useRef(null);

  const checkOutHandler = async () => {
    if (!checkoutUrl) {
      // Proceed to delete cart
      return;
    }
    if (totalQuantityInCart === 0) return toast.error("Your cart is empty!");
    window.open(checkoutUrl);
  };

  // const fetchAllItems = async (cartId) => {
  //   try {
  //     setCartLoading(true);
  //     setItemsQuantity(0); // so that the checkout button can be disabled
  //     const response = await getItemsInCartAPI(cartId);
  //     const itemsQuantity = response?.totalQuantity;
  //     setItemsQuantity(itemsQuantity);
  //     dispatch(setCheckoutUrl(response?.checkoutUrl));
  //     const products = response?.lines?.edges;
  //     dispatch(setProductsinCart(products));
  //   } catch (error) {
  //     console.error(error);
  //     if (error?.message?.includes("GraphQL error(s)")) {
  //       toast.error("Something went wrong");
  //     } else if (error?.meesage) {
  //       toast.error(error.message);
  //     } else {
  //       toast.error("Something went wrong!");
  //     }
  //   } finally {
  //     setCartLoading(false);
  //   }
  // };

  const continueShoppingHandler = () => {
    toggleCartOpen();
  };

  useEffect(() => {
    console.log(productsInCart);
  }, [productsInCart]);

  const closeCartHandler = () => {
    toggleCartOpen();
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }} // Fade in/out for the backdrop
          onClick={closeCartHandler}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            position: "fixed",
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
            width: "100vw",
            zIndex: 5000000,
            margin: 0,
          }}
        >
          <motion.div
            key="box"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{
              duration: 0.5, // Duration of the sliding in/out animation
              ease: "linear",
              delay: 0, // Delay so the backdrop mounts first
            }}
            onClick={(e) => e.stopPropagation()}
            ref={cartRef}
            className={`border-2 absolute z-[100]  top-0 bottom-0 right-0 transition-transform duration-300 ease-in-out bg-[#ffff] w-[100vw] sm:w-[500px] dark:!bg-black dark:!text-white`}
          >
            <div className="flex items-center justify-between border-b-2 p-4">
              <h1 className="text-2xl font-black">MY CART</h1>
              <button
                className="border-2 px-2 shadow-lg"
                onClick={toggleCartOpen}
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col h-full pb-4">
              <div className="flex flex-col gap-4 h-5/6 p-4">
                {cartLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width={"100%"}
                    height={"100%"}
                    className="p-3 dark:bg-white"
                  />
                ) : (
                  <>
                    <h2 className="font-black">
                      Added Products ({totalQuantityInCart})
                    </h2>
                    <div className="flex flex-col gap-2 overflow-auto">
                      {productsInCart?.map((el) => (
                        <CartItem
                          key={el?.node?.id}
                          cartLineId={el?.node?.id}
                          cartId={cartId}
                          src={el?.node?.merchandise?.image?.src}
                          quantity={el?.node?.quantity}
                          title={el?.node?.merchandise?.product?.title}
                          pricePerItem={el?.node?.merchandise?.price}
                          productId={el?.node?.merchandise?.id}
                          size={
                            el?.node?.merchandise?.selectedOptions?.find(
                              (el) => el?.name === "Size"
                            )?.value
                          }
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-around font-outfit">
                <button
                  onClick={continueShoppingHandler}
                  className="text-[#1F4A40] dark:text-[#ffff] border-1 border-[#1F4A40] px-2 py-1 flex items-center gap-2"
                >
                  <HiArrowNarrowLeft /> Continue Shopping
                </button>
                <button
                  onClick={checkOutHandler}
                  className="disabled:opacity-50 bg-[#1F4A40] px-2 py-1 text-[#ffff]"
                  disabled={totalQuantityInCart > 0 ? false : true}
                >
                  Continue to Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
