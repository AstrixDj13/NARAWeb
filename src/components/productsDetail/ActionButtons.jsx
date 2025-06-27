import { FaPlus } from "react-icons/fa";
import { MdBookmarkBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import createCart, {
  addItemToCart,
  createAuthenticatedCart,
  getItemsInCartAPI,
} from "../../apis/Cart";
import { toast } from "sonner";
import {
  setActiveCartId,
  setCheckoutUrl,
  setProductsinCart,
  setTotalQuantityInCart,
} from "../../store";
import { useState } from "react";
import Spinner from "../utils/Spinner";
import CartToast from "../utils/CartToast";
import { ToastContainer, toast as customToast } from "react-toastify";
export default function ActionButtons() {
  const [addingToThecart, setAddingToTheCart] = useState(false);
  const [buyNowBtnClicked, setBuyNowBtnClicked] = useState(false);
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
      const cartId = cart.id;
      const checkoutUrl = cart.checkoutUrl;
      customToast(<CartToast />);
      dispatch(setActiveCartId(cartId));
      dispatch(setCheckoutUrl(checkoutUrl));
      dispatch(setProductsinCart(cart.lines.edges));
      dispatch(setTotalQuantityInCart(cart.totalQuantity));
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
      customToast(<CartToast />);
      dispatch(setActiveCartId(cartId));
      dispatch(setCheckoutUrl(checkoutUrl));
      dispatch(setProductsinCart(cart.lines.edges));
      dispatch(setTotalQuantityInCart(cart.totalQuantity));
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
      const checkoutUrl = cart.checkoutUrl;
      window.open(checkoutUrl);
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

      const checkoutUrl = cart.checkoutUrl;
      window.open(checkoutUrl);
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
    <div className="md:static fixed z-[2] bottom-0 right-0 left-0 bg-[#ffff] md:bg-transparent flex sm:flex-row  justify-center md:justify-start border-2 md:border-none shadow-lg md:!shadow-none dark:bg-black !font-outfit text-sm md:text-base p-2 md:!p-0 ">

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
        onClick={addToCartHandler}
        disabled={productOutOfStock || addingToThecart}
        className={` disabled:bg-gray-400 mr-2  px-4 py-2  ${
          addingToThecart ? "bg-gray-800" : " bg-[#1F4A40]"
        }   text-white border-2 shadow-lg xl:!shadow-none flex items-center justify-center gap-2`}
      >
        {addingToThecart ? (
          "Adding Item..."
        ) : (
          <>
            {" "}
            <FaPlus /> <pan>Add Item</pan>{" "}
          </>
        )}
      </button>

      <div className="realtive">
        <button
          disabled={!currentVariant}
          className="relative mr-2 disabled:text-gray-200 px-4 py-2 border-2 shadow-lg xl:!shadow-none"
          onClick={buyNowHandler}
        >
          {buyNowBtnClicked && (
            <div className="absolute flex items-center justify-center top-0 right-0 left-0 bottom-0">
              <Spinner />
            </div>
          )}

          <span className={buyNowBtnClicked && "opacity-0"}>Buy Now</span>
        </button>
      </div>

      {/* <button className="px-2 py-2 border-2 shadow-lg flex items-center justify-center">
        <MdBookmarkBorder size={24} />
      </button> */}
    </div>
  );
}
