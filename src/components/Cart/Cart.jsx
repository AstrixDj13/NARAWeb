import { useEffect, useRef, useCallback, useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getItemsInCartAPI, updateBuyersIndentity } from "../../apis/Cart";
import getAccountDetailsAPI from "../../apis/getAccoutDetailsAPI";
import { fixCheckoutUrl } from "../../utils/interceptors";
import { Skeleton } from "@mui/material";

import { setCheckoutUrl, setProductsinCart } from "../../store";
import CartItem from "./CartItem";
import YouMayAlsoLike from "./YouMayAlsoLike";

export default function Cart({ toggleCartOpen, cartOpen }) {
  const totalQuantityInCart = useSelector((state) => state.cart.totalQuantity);
  const checkoutUrl = useSelector((state) => state.cart.checkoutUrl);
  const cartId = useSelector((state) => state.cart.id);
  const productsInCart = useSelector((state) => state.cart.productsInCart);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const accessToken = useSelector((state) => state.user.accessToken);
  const dispatch = useDispatch();

  const [cartLoading, setCartLoading] = useState(false);
  const [itemsQuantity, setItemsQuantity] = useState(0);

  const cartRef = useRef(null);

  const checkOutHandler = async () => {
    const fixedUrl = fixCheckoutUrl(checkoutUrl);
    if (!fixedUrl) {
      toast.error("Unable to proceed to checkout. Please try again.");
      return;
    }
    if (totalQuantityInCart === 0) return toast.error("Your cart is empty!");

    // Enhance buyer identity if authenticated
    if (isAuthenticated && accessToken) {
      try {
        const customerDetails = await getAccountDetailsAPI();
        if (customerDetails && customerDetails.defaultAddress) {
          const address = customerDetails.defaultAddress;
          const deliveryAddress = {
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            country: "IN", // Assuming IN based on other code
            firstName: address.firstName,
            lastName: address.lastName,
            province: address.province,
            zip: address.zip
          };

          await updateBuyersIndentity(cartId, customerDetails.email, deliveryAddress, customerDetails.phone);
          console.log("Buyer identity updated successfully");
        }
      } catch (err) {
        console.error("Failed to update buyer identity:", err);
        // Continue to checkout even if this fails
      }
    }

    window.location.href = fixedUrl;
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

  // Calculate subtotal
  const calculateSubtotal = () => {
    if (!productsInCart || productsInCart.length === 0) return 0;
    return productsInCart.reduce((total, item) => {
      const price = parseFloat(item?.node?.merchandise?.price?.amount || 0);
      const quantity = item?.node?.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

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
            <div className="flex flex-col" style={{ height: 'calc(100% - 60px)' }}>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
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
                    <div className="flex flex-col gap-2">
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
                <YouMayAlsoLike />

                {/* Offers Section */}
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h3 className="font-bold text-sm mb-2">Available Offers</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded font-semibold">XMAS25</span>
                      <p className="text-gray-700 dark:text-gray-300">FLAT 25% Off on Selected Items</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded font-semibold">BOGO</span>
                      <p className="text-gray-700 dark:text-gray-300">B1G1 on the Entire MEL Edit</p>
                    </div>
                  </div>
                </div>


                {/* Subtotal and Checkout Section Combined */}
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-lg">Subtotal:</span>
                    <span className="font-bold text-lg text-[#1F4A40] dark:text-green-400">₹{subtotal.toFixed(2)}</span>
                  </div>

                  {/* Checkout Buttons */}
                  <div className="flex justify-between gap-2">
                    <button
                      onClick={continueShoppingHandler}
                      className="text-[#1F4A40] dark:text-[#ffff] border-1 border-[#1F4A40] px-3 py-2 flex items-center gap-2 flex-1"
                    >
                      <HiArrowNarrowLeft /> Continue Shopping
                    </button>
                    <button
                      onClick={checkOutHandler}
                      className="disabled:opacity-50 bg-[#1F4A40] px-3 py-2 text-[#ffff] flex-1"
                      disabled={totalQuantityInCart > 0 ? false : true}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
