import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  setAuthStatus,
  setActiveCartId,
  setTotalQuantityInCart,
  setProductsinCart,
  setCheckoutUrl,
  deleteCart,
  setUser,
} from "./store";
import getAccountDetailsAPI, { updateCustomerDefaultAddress } from "./apis/getAccoutDetailsAPI";
import createCart, {
  getCheckoutURL,
  getItemsInCartAPI,
  updateBuyersIndentity,
} from "./apis/Cart";
import { getProductVariantDetail } from "./apis/Products";
import Howler from "howler";
import Chatbot from "./components/Chatbot";
import useEventTracker from "./hooks/EventTracker";
function App() {
  const dispatch = useDispatch();
  const fetchedCartId = useSelector((state) => state.cart.id);
  const { pathname } = useLocation();
  const [soundOn, setSound] = useState(true);
  const soundRef = useRef(null);

  // Analytics Tracking
  const { trackEvent } = useEventTracker();

  useEffect(() => {
    trackEvent('page_view', { page_path: pathname });
  }, [pathname, trackEvent]);


  const fetchAllItemsInCart = async (cartId) => {
    try {
      const response = await getItemsInCartAPI(cartId);
      console.log("response", response);
      const itemsQuantity = response?.totalQuantity;
      dispatch(setTotalQuantityInCart(itemsQuantity));
      dispatch(setCheckoutUrl(response?.checkoutUrl));

      const products = response?.lines?.edges;
      dispatch(setProductsinCart(products));
      console.log("Total Quantity", itemsQuantity);
      console.log("products", products);
    } catch (error) {
      console.error(error);
      if (error?.message?.includes("GraphQL error(s)")) {
        toast.error("Something went wrong");
      } else if (error?.message === "Thank You for shopping with us!") {
        localStorage.removeItem("cartId");
        dispatch(deleteCart());
        toast.info(error?.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      dispatch(setAuthStatus({ accessToken, isAuthenticated: true }));
      getAccountDetailsAPI()
        .then((customer) => {
          dispatch(
            setUser({
              id: customer.id,
              fullName: customer.firstName + " " + customer.lastName,
              email: customer.email,
              phone: customer.phone,
            })
          );
        })
        .catch((err) => console.error("Failed to fetch user details", err));
    }

    const cartId = localStorage.getItem("cartId");

    if (cartId) {
      dispatch(setActiveCartId(cartId));
      fetchAllItemsInCart(cartId);
    }

  }, []);

  return (
    <div className="cursor-custom dark:!bg-black font-antikor">
      <Toaster position="top-center" richColors />
      <Outlet />
      <Chatbot /> {/* ✅ Chatbot with Shopify MCP integration */}
    </div>
  );
}
export default App;
