import { FaPlus } from "react-icons/fa";
import { MdBookmarkBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import createCart, {
  addItemToCart,
  createAuthenticatedCart,
  getItemsInCartAPI,
  updateBuyersIndentity,
} from "../../apis/Cart";
import getAccountDetailsAPI from "../../apis/getAccoutDetailsAPI";
import { fixCheckoutUrl } from "../../utils/interceptors";
import { toast } from "sonner";
import {
  setActiveCartId,
  setCheckoutUrl,
  setProductsinCart,
  setTotalQuantityInCart,
  setIsCartOpen,
} from "../../store";
import { useState } from "react";
import Spinner from "../utils/Spinner";
import CartToast from "../utils/CartToast";
import { ToastContainer, toast as customToast } from "react-toastify";
import { useEventTracker } from "../../hooks/EventTracker";

export default function ActionButtons({ inline = false }) {
  const [addingToThecart, setAddingToTheCart] = useState(false);
  const [buyNowBtnClicked, setBuyNowBtnClicked] = useState(false);
  const { trackEvent } = useEventTracker();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const accessToken = useSelector((state) => state.user.accessToken);

  const currentVariant = useSelector(
    (state) => state.activeProduct.currentVariant
  );
  const productOutOfStock = useSelector(
    (state) => state.activeProduct.outOfStock
  );
  const cartId = useSelector((state) => state.cart.id);
  const dispatch = useDispatch();

  const createCartWithOneitem = async (variantId) => {
    try {
      setAddingToTheCart(true);
      const cart = await createCart(variantId);
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [variantId],
          content_type: 'product',
          value: 1, // or actual price
          currency: 'INR'
        });
      }
      const cartId = cart.id;
      const checkoutUrl = cart.checkoutUrl;
      customToast(<CartToast />);
      dispatch(setActiveCartId(cartId));
      dispatch(setCheckoutUrl(checkoutUrl));
      dispatch(setProductsinCart(cart.lines.edges));
      dispatch(setTotalQuantityInCart(cart.totalQuantity));
      dispatch(setIsCartOpen(true));
      localStorage.setItem("cartId", cartId);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setAddingToTheCart(false);
    }
  };

  const createLoggedInCart = async (variantId, customerAccessToken) => {
    try {
      setAddingToTheCart(true);
      const cart = await createAuthenticatedCart(
        variantId,
        customerAccessToken
      );
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [variantId],
          content_type: 'product',
          value: 1, // or actual price
          currency: 'INR'
        });
      }
      const cartId = cart.id;
      const checkoutUrl = cart.checkoutUrl;
      customToast(<CartToast />);
      dispatch(setActiveCartId(cartId));
      dispatch(setCheckoutUrl(checkoutUrl));
      dispatch(setProductsinCart(cart.lines.edges));
      dispatch(setTotalQuantityInCart(cart.totalQuantity));
      dispatch(setIsCartOpen(true));
      localStorage.setItem("cartId", cartId);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setAddingToTheCart(false);
    }
  };

  const addAnotherItemToTheCart = async (cartId, variantId) => {
    try {
      setAddingToTheCart(true);
      const response = await addItemToCart(cartId, variantId);
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          content_ids: [variantId],
          content_type: 'product',
          value: 1, // or actual price
          currency: 'INR'
        });
      }
      console.log("logging from add to cart:", response);
      const itemsQuantity = response?.totalQuantity;
      dispatch(setTotalQuantityInCart(itemsQuantity));
      dispatch(setCheckoutUrl(response?.checkoutUrl));
      const products = response?.lines?.edges;
      dispatch(setProductsinCart(products));
      console.log(products);
      dispatch(setIsCartOpen(true));
      customToast(<CartToast />);
    } catch (error) {
      console.error(error);
      if (error.message.includes("GraphQL error(s)")) {
        // we should email this
        toast.error("Something went wrong");
      } else {
        toast.info(error.message);
      }
    } finally {
      setAddingToTheCart(false);
    }
  };

  const addToCartHandler = () => {
    if (!currentVariant || productOutOfStock) {
      console.log("variant is non existant at this point!");
      return;
    }

    const variantId = currentVariant.node.id;

    trackEvent('AddToCart', {
      variant_id: variantId,
      currency: "INR"
    });

    if (cartId) {
      const variantId = currentVariant.node.id;
      addAnotherItemToTheCart(cartId, variantId);
    } else if (isAuthenticated) {
      console.log(
        "since user is authenticated here is the authenticated cart: "
      );
      createLoggedInCart(variantId, accessToken);
    } else {
      console.log(
        "The user is not authenticated, here is the non authenticated cart:"
      );
      createCartWithOneitem(variantId);
    }
  };

  const createCartAndCheckout = async (variantId) => {
    try {
      setBuyNowBtnClicked(true);
      const cart = await createCart(variantId);
      console.log("URL FROM CART:", cart.checkoutUrl);
      const checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
      console.log("Checkout URL:", checkoutUrl);
      if (!checkoutUrl || !checkoutUrl.startsWith('http')) {
        toast.error("Unable to get checkout URL. Please try again.");
        return;
      }
      trackEvent('InitiateCheckout', { variant_id: variantId, currency: "INR" });
      trackEvent('Purchase', { variant_id: variantId, currency: "INR" });
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setBuyNowBtnClicked(false);
    }
  };

  const checkoutForLoggedInUser = async (variantId, customerAccessToken) => {
    try {
      setBuyNowBtnClicked(true);
      const cart = await createAuthenticatedCart(
        variantId,
        customerAccessToken
      );
      console.log("URL FROM CART:", cart.checkoutUrl);
      const checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
      console.log("Checkout URL (authenticated):", checkoutUrl);

      // Enhance buyer identity
      try {
        const customerDetails = await getAccountDetailsAPI();
        if (customerDetails && customerDetails.defaultAddress) {
          const address = customerDetails.defaultAddress;
          const deliveryAddress = {
            address1: address.address1,
            address2: address.address2,
            city: address.city,
            country: "IN", // Assuming IN based on other code, or we could fetch country if available in API
            firstName: address.firstName,
            lastName: address.lastName,
            province: address.province,
            zip: address.zip
          };

          await updateBuyersIndentity(cart.id, customerDetails.email, deliveryAddress, customerDetails.phone);
          console.log("Buyer identity updated successfully");
        }
      } catch (err) {
        console.error("Failed to update buyer identity:", err);
        // Continue to checkout even if this fails
      }

      if (!checkoutUrl || !checkoutUrl.startsWith('http')) {
        toast.error("Unable to get checkout URL. Please try again.");
        return;
      }
      trackEvent('InitiateCheckout', { variant_id: variantId, currency: "INR" });
      //trackEvent('Purchase', { variant_id: variantId, currency: "INR" });
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setBuyNowBtnClicked(false);
    }
  };

  const buyNowHandler = () => {
    if (isAuthenticated && accessToken) {
      checkoutForLoggedInUser(currentVariant.node.id, accessToken);
    } else {
      createCartAndCheckout(currentVariant.node.id);
    }
  };

  return (
    <div className={inline
      ? "flex flex-wrap gap-2 w-full bg-transparent !font-outfit text-sm"
      : "md:static fixed z-[2] bottom-0 right-0 left-0 bg-[#ffff] md:bg-transparent flex flex-wrap sm:flex-nowrap justify-center md:justify-start gap-2 border-2 md:border-none shadow-lg md:!shadow-none dark:bg-black !font-outfit text-sm md:text-base p-2 md:!p-0"
    }>

      <ToastContainer
        hideProgressBar={true}
        autoClose={800}
        closeOnClick
        closeButton={false}
        position="bottom-center"
        style={{
          backgroundColor: 0,
          width: "20em",
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "0",
        }}
      />

      <button
        disabled={!currentVariant}
        className={`relative disabled:bg-gray-400 flex-1 sm:flex-none disabled:text-gray-200 px-4 py-1 border-2 shadow-lg xl:!shadow-none flex flex-col items-center justify-center gap-1 min-w-[120px] text-white ${buyNowBtnClicked ? "bg-gray-800" : "bg-[#1F4A40]"}`}
        onClick={buyNowHandler}
      >
        {buyNowBtnClicked && (
          <div className="absolute flex items-center justify-center top-0 right-0 left-0 bottom-0">
            <Spinner />
          </div>
        )}

        <span className={buyNowBtnClicked ? "opacity-0" : "flex flex-col sm:flex-row items-center gap-1 sm:gap-2 whitespace-nowrap"}>
          <span>Buy Now</span>
          <div className="flex items-center gap-[3px]">
            <img src="/icons/upi.png" alt="UPI" className="h-4 w-auto object-contain bg-white rounded px-[1px]" />
            <img src="/icons/phonepe.jpg" alt="PhonePe" className="h-4 w-auto object-contain bg-white rounded px-[1px]" />
            <img src="/icons/gpay.webp" alt="GPay" className="h-4 w-auto object-contain bg-white rounded px-[1px]" />
            <span className="text-[10px] bg-white text-black font-bold px-[3px] rounded">+18</span>
          </div>
        </span>
      </button>

      {!productOutOfStock && (
        <button
          onClick={addToCartHandler}
          disabled={addingToThecart}
          className="px-4 py-2 flex-1 sm:flex-none border-2 shadow-lg flex items-center justify-center gap-2 text-black disabled:opacity-50 whitespace-nowrap"
          style={{ backgroundColor: "#ECEBB6" }}
        >
          {addingToThecart ? (
            "Adding Item..."
          ) : (
            <>
              {" "}
              <FaPlus /> <span>Add to Cart</span>{" "}
            </>
          )}
        </button>
      )}

      {/* <button className="px-2 py-2 border-2 shadow-lg flex items-center justify-center">
        <MdBookmarkBorder size={24} />
      </button> */}
    </div>
  );
}
