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
import { initiateMagicCheckout } from "../../utils/magicCheckout";
import { toast } from "sonner";
import {
  setActiveCartId,
  setCheckoutUrl,
  setProductsinCart,
  setTotalQuantityInCart,
  setIsCartOpen,
  promptForSize,
} from "../../store";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import Spinner from "../utils/Spinner";
import CartToast from "../utils/CartToast";
import { ToastContainer, toast as customToast } from "react-toastify";
import { useEventTracker } from "../../hooks/EventTracker";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext";

export default function ActionButtons({ inline = false, productId, productTitle, editorial = false }) {
  const [addingToThecart, setAddingToTheCart] = useState(false);
  const [buyNowBtnClicked, setBuyNowBtnClicked] = useState(false);
  const { trackEvent } = useEventTracker();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const accessToken = useSelector((state) => state.user.accessToken);

  const currentVariant = useSelector(
    (state) => state.activeProduct.currentVariant
  );
  
  const fullProductId = productId || currentVariant?.node?.product?.id;

  const { wishlist, toggleWishlist } = useWishlist();
  const isWishlisted = fullProductId ? wishlist.includes(fullProductId) : false;

  const productOutOfStock = useSelector(
    (state) => state.activeProduct.outOfStock
  );
  const cartId = useSelector((state) => state.cart.id);
  const sizeRequired = useSelector((state) => state.activeProduct.sizeRequired);
  const sizeConfirmed = useSelector((state) => state.activeProduct.sizeConfirmed);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addedItem, setAddedItem] = useState(null);

  // No size is pre-selected: ask the shopper to pick one before adding / buying
  const ensureSizeSelected = () => {
    if (sizeRequired && !sizeConfirmed) {
      dispatch(promptForSize(Date.now()));
      document.getElementById("size-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.info("Please select a size");
      return false;
    }
    return true;
  };

  const showAddedSheet = () => {
    const node = currentVariant?.node;
    setAddedItem({
      title: productTitle || node?.product?.title || document.title.split("|")[0].trim(),
      variantTitle: node?.title && node.title !== "Default Title" ? node.title : "",
      image: node?.image?.src || "",
      price: node?.price?.amount,
    });
  };

  const createCartWithOneitem = async (variantId) => {
    try {
      setAddingToTheCart(true);
      const cart = await createCart(variantId);
      const cartId = cart.id;
      const checkoutUrl = cart.checkoutUrl;
      showAddedSheet();
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
      const cartId = cart.id;
      const checkoutUrl = cart.checkoutUrl;
      showAddedSheet();
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
      console.log("logging from add to cart:", response);
      const itemsQuantity = response?.totalQuantity;
      dispatch(setTotalQuantityInCart(itemsQuantity));
      dispatch(setCheckoutUrl(response?.checkoutUrl));
      const products = response?.lines?.edges;
      dispatch(setProductsinCart(products));
      console.log(products);
      dispatch(setIsCartOpen(true));
      showAddedSheet();
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
    if (!ensureSizeSelected()) return;

    const variantId = currentVariant.node.id;
    const rawPrice = currentVariant?.node?.price?.amount;
    const numPrice = rawPrice ? parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) : 0;

    trackEvent('AddToCart', {
      variant_id: variantId,
      content_ids: [variantId],
      currency: "INR",
      value: numPrice,
      price: numPrice,
      product_name: currentVariant?.node?.product?.title || currentVariant?.node?.title || document.title,
      quantity: 1
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

  // Buy Now uses its own one-item cart, so the customer's main cart is left untouched.
  // Falls back to Shopify checkout (checkoutUrl) if Magic Checkout is unavailable.
  const openMagicCheckoutForBuyNow = async (cart, checkoutUrl, customerInfo) => {
    await initiateMagicCheckout({
      cartId: cart.id,
      productsInCart: cart.lines?.edges || [],
      totalQuantity: cart.totalQuantity,
      customerDetails: customerInfo,
      fallbackUrl: checkoutUrl,
      // Purchase tracking and the redirect to /order-confirmation happen inside magicCheckout
    });
  };

  const createCartAndCheckout = async (variantId) => {
    try {
      setBuyNowBtnClicked(true);
      const rawPrice = currentVariant?.node?.price?.amount;
      const numPrice = rawPrice ? parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) : 0;

      const cart = await createCart(variantId);
      console.log("URL FROM CART:", cart.checkoutUrl);
      const checkoutUrl = fixCheckoutUrl(cart.checkoutUrl);
      console.log("Checkout URL:", checkoutUrl);
      if (!checkoutUrl || !checkoutUrl.startsWith('http')) {
        toast.error("Unable to get checkout URL. Please try again.");
        return;
      }
      trackEvent('InitiateCheckout', {
        variant_id: variantId,
        content_ids: [variantId],
        value: numPrice,
        currency: "INR",
        num_items: 1
      });
      await openMagicCheckoutForBuyNow(cart, checkoutUrl, {});
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
      const customerInfo = {};
      try {
        const customerDetails = await getAccountDetailsAPI();
        if (customerDetails) {
          customerInfo.email = customerDetails.email || "";
          customerInfo.phone = customerDetails.phone || "";
          customerInfo.name = `${customerDetails.firstName || ""} ${customerDetails.lastName || ""}`.trim();
        }
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
      const rawPrice = currentVariant?.node?.price?.amount;
      const numPrice = rawPrice ? parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) : 0;
      trackEvent('InitiateCheckout', {
        variant_id: variantId,
        content_ids: [variantId],
        value: numPrice,
        currency: "INR",
        num_items: 1
      });
      await openMagicCheckoutForBuyNow(cart, checkoutUrl, customerInfo);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setBuyNowBtnClicked(false);
    }
  };

  const buyNowHandler = () => {
    if (!currentVariant || !ensureSizeSelected()) return;
    if (isAuthenticated && accessToken) {
      checkoutForLoggedInUser(currentVariant.node.id, accessToken);
    } else {
      createCartAndCheckout(currentVariant.node.id);
    }
  };

  return (
    <div className={inline
      ? "flex flex-wrap gap-2 w-full bg-transparent !font-outfit text-sm"
      : "md:static fixed z-[100] md:z-auto bottom-0 right-0 left-0 bg-white md:bg-transparent flex gap-2 border-t border-gray-200 md:border-none shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:!shadow-none dark:bg-black dark:border-gray-800 !font-outfit text-sm md:text-base px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:!p-0 w-full"
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

      {productOutOfStock ? (
        <button
          disabled
          className="flex-1 h-12 bg-gray-300 text-gray-600 font-semibold uppercase tracking-wider cursor-not-allowed"
        >
          Out of stock
        </button>
      ) : (
        <>
          <button
            onClick={addToCartHandler}
            disabled={addingToThecart || !currentVariant}
            className={editorial
              ? "flex-1 h-12 border border-black bg-white text-black dark:bg-black dark:text-white dark:border-white text-xs font-semibold uppercase tracking-[0.18em] disabled:opacity-60 whitespace-nowrap"
              : "flex-1 h-12 border-2 border-[#1F4A40] bg-white text-[#1F4A40] dark:bg-black dark:text-[#D8E3B1] dark:border-[#D8E3B1] font-semibold uppercase tracking-wider disabled:opacity-60 whitespace-nowrap"}
          >
            {addingToThecart ? "Adding…" : "Add to Bag"}
          </button>

          <button
            onClick={buyNowHandler}
            disabled={!currentVariant || buyNowBtnClicked}
            className={editorial
              ? "relative flex-1 h-12 bg-black text-white dark:bg-white dark:text-black text-xs font-semibold uppercase tracking-[0.18em] disabled:opacity-80 whitespace-nowrap"
              : "relative flex-1 h-12 bg-[#1F4A40] text-white font-semibold uppercase tracking-wider disabled:opacity-80 whitespace-nowrap"}
          >
            {buyNowBtnClicked && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </span>
            )}
            <span className={buyNowBtnClicked ? "opacity-0" : ""}>Buy Now</span>
          </button>
        </>
      )}

      {/* Quick view keeps its own wishlist button; on the product page the heart sits next to the title */}
      {inline && fullProductId && (
        <button
          onClick={() => toggleWishlist(fullProductId)}
          className="h-12 px-4 border-2 flex items-center justify-center gap-2 text-black whitespace-nowrap bg-white hover:bg-gray-50 transition-colors"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? <FaHeart className="text-red-500" size={18} /> : <FaRegHeart size={18} />}
        </button>
      )}

      {/* Added-to-bag confirmation */}
      {addedItem && createPortal(
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label="Added to bag">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddedItem(null)} />
          <div className="relative w-full md:w-[420px] bg-white dark:bg-[#111] text-black dark:text-white rounded-t-2xl md:rounded-2xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <p className="flex items-center gap-2 font-semibold">
                <FaCheckCircle className="text-[#1E7B74]" /> Added to your bag
              </p>
              <button onClick={() => setAddedItem(null)} aria-label="Close" className="p-1 text-gray-500 hover:text-black dark:hover:text-white">
                <FaTimes />
              </button>
            </div>
            <div className="flex gap-4 mb-5">
              {addedItem.image && (
                <img src={addedItem.image} alt={addedItem.title} className="w-16 h-20 object-cover rounded-md bg-gray-100" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-snug">{addedItem.title}</p>
                {addedItem.variantTitle && <p className="text-sm text-gray-500 mt-1">Size: {addedItem.variantTitle}</p>}
                {addedItem.price && (
                  <p className="text-sm font-semibold mt-1">₹{Number(addedItem.price).toLocaleString("en-IN")}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setAddedItem(null); navigate("/cart"); }}
                className="h-12 bg-[#1F4A40] text-white font-semibold uppercase tracking-wider"
              >
                View bag &amp; checkout
              </button>
              <button
                onClick={() => setAddedItem(null)}
                className="h-12 border-2 border-gray-300 dark:border-gray-700 font-semibold uppercase tracking-wider"
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
