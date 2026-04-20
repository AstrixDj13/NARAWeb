import { useEffect, useRef, useState, Suspense, lazy } from "react";
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
import useEventTracker from "./hooks/EventTracker";
import SpinningWheel from "./components/SpinningWheel";
const Chatbot = lazy(() => import("./components/Chatbot"));
function App() {
  const dispatch = useDispatch();
  const fetchedCartId = useSelector((state) => state.cart.id);
  const productsInCart = useSelector((state) => state.cart.productsInCart);
  const { pathname } = useLocation();
  const [soundOn, setSound] = useState(true);
  const soundRef = useRef(null);

  // Analytics Tracking
  const { trackEvent } = useEventTracker();

  useEffect(() => {
    trackEvent('PageView', { page_path: pathname });
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
        const total = (productsInCart || []).reduce((sum, edge) => {
          const price = parseFloat(edge?.node?.merchandise?.price?.amount || 0);
          const qty = edge?.node?.quantity || 1;
          return sum + price * qty;
        }, 0);
        fbq('track', 'Purchase', {
          value: total,
          currency: 'INR'
        });
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
          // Extract the numeric ID from the GID if present, or just store the ID if not GID
          const numericId = customer.id ? customer.id.split('/').pop().split('?')[0] : null;
          if (numericId) {
            localStorage.setItem("user_id", numericId);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch user details", err);
          localStorage.removeItem("user_id");
        });
    }

    const cartId = localStorage.getItem("cartId");

    if (cartId) {
      dispatch(setActiveCartId(cartId));
      fetchAllItemsInCart(cartId);
    }

  }, []);

  const [showSpinningWheel, setShowSpinningWheel] = useState(false);

  useEffect(() => {
    const checkWheel = async () => {
      // 1. check local storage first
      const hasSpunLocal = localStorage.getItem('hasSpunWheel');
      if (hasSpunLocal === 'true') return;

      // 2. check backend
      try {
        let customerId = localStorage.getItem('user_id');
        let anonymousId = localStorage.getItem('anonymous_id');

        if (!customerId && !anonymousId) {
          setShowSpinningWheel(true);
          return;
        }

        const params = new URLSearchParams();
        if (customerId) params.append('customerId', customerId);
        if (anonymousId) params.append('anonymousId', anonymousId);

        const res = await fetch(`${import.meta.env.VITE_EVENT_API_URL || 'http://localhost:3001'}/api/spinning-wheel/check?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!data.hasSpun) {
            setShowSpinningWheel(true);
          } else {
            localStorage.setItem('hasSpunWheel', 'true');
          }
        } else {
          setShowSpinningWheel(true);
        }
      } catch (err) {
        console.error("Failed to check spinning wheel status", err);
        // Fail open: show it if checking fails
        setShowSpinningWheel(true);
      }
    };
    const timer = setTimeout(() => {
      checkWheel();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="cursor-custom dark:!bg-black font-antikor">
      <Toaster position="top-center" richColors />
      <Outlet />
      {pathname === "/" && (
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      )} {/* ✅ Chatbot with Shopify MCP integration */}
      {showSpinningWheel && <SpinningWheel onClose={() => setShowSpinningWheel(false)} />}
    </div>
  );
}
export default App;
