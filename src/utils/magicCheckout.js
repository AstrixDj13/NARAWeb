import { toast } from "react-toastify";
import { trackEvent } from "../hooks/EventTracker";

const MAGIC_SCRIPT_SRC = "https://checkout.razorpay.com/v1/magic-checkout.js";

/**
 * Dynamically loads the Razorpay Magic Checkout script (headless Shopify flow, step 1.3)
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay && document.querySelector(`script[src="${MAGIC_SCRIPT_SRC}"]`)) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = MAGIC_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay checkout script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Extracts the numeric ID from a Shopify GID string.
 * Example: 'gid://shopify/ProductVariant/448293819283' -> '448293819283'
 */
export const extractNumericId = (gid) => {
  if (!gid) return null;
  const str = String(gid);
  const parts = str.split("/");
  const lastPart = parts[parts.length - 1];
  return /^\d+$/.test(lastPart) ? lastPart : str;
};

/**
 * Extracts a clean cart token from a Shopify cart ID.
 * Example: 'gid://shopify/Cart/Z2Nw...ecc245...' -> token
 */
export const extractCartToken = (cartId) => {
  if (!cartId) return null;
  const str = String(cartId);
  return str.replace("gid://shopify/Cart/", "").trim();
};

/**
 * Formats cart lines into the structure expected by Razorpay Magic Checkout
 */
export const formatCartForMagicCheckout = (cartId, productsInCart, totalQuantity) => {
  const token = extractCartToken(cartId);

  const items = (productsInCart || []).map((edge) => {
    const node = edge?.node || edge;
    const variantId = node?.merchandise?.id;
    const productId = node?.merchandise?.product?.id;
    const numericVariantId = extractNumericId(variantId);
    const numericProductId = extractNumericId(productId);

    return {
      id: numericVariantId,
      variant_id: numericVariantId,
      product_id: numericProductId || numericVariantId,
      quantity: node?.quantity || 1,
      properties: {}
    };
  });

  return {
    token,
    item_count: totalQuantity || items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    items
  };
};

const readCookie = (name) => {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : undefined;
};

/**
 * Step 1.5: Complete Checkout — tells Razorpay to create the Shopify order.
 * Retries a few times because the payment has already been captured at this point.
 */
const completeShopifyCheckout = async (keyId, paymentResponse, attempts = 3) => {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(
        `https://api.razorpay.com/v1/1cc/shopify/complete?key_id=${encodeURIComponent(keyId)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
          }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (res.ok) return json;
      lastError = new Error(json?.error?.description || json?.Description || `Complete checkout failed (${res.status})`);
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
  }
  throw lastError;
};

/**
 * Initiates Razorpay Magic Checkout with full fallback support.
 *
 * @param {Object} params
 * @param {string} params.cartId - Shopify cart ID
 * @param {Array} params.productsInCart - Array of cart item edges/nodes
 * @param {number} params.totalQuantity - Total number of items
 * @param {Object} [params.customerDetails] - Pre-filled customer info ({ name, email, phone })
 * @param {string} [params.fallbackUrl] - Standard Shopify checkout URL to redirect to if Magic Checkout is unavailable
 * @param {string} [params.couponCode] - Shopify discount code to auto-apply (step 1.4)
 * @param {Function} [params.onSuccess] - Called with the Complete Checkout result ({ order_status_url, ... }) after the Shopify order is created.
 *   If the result has order_status_url, the user is redirected there after onSuccess runs.
 * @param {Function} [params.onError] - Callback on payment or session error
 */
export const initiateMagicCheckout = async ({
  cartId,
  productsInCart,
  totalQuantity,
  customerDetails = {},
  couponCode = "",
  fallbackUrl = null,
  onSuccess = () => {},
  onError = () => {}
}) => {
  try {
    // 1. Ensure Razorpay script is loaded
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      console.warn("Unable to load Razorpay checkout SDK. Falling back to standard checkout.");
      if (fallbackUrl) {
        window.location.href = fallbackUrl;
        return;
      }
      throw new Error("Unable to load checkout gateway.");
    }

    // 2. Prepare cart payload & analytics data
    const formattedCart = formatCartForMagicCheckout(cartId, productsInCart, totalQuantity);
    if (!formattedCart.token || formattedCart.items.length === 0) {
      throw new Error("Your cart is empty or invalid.");
    }

    const cartItems = (productsInCart || []).map((edge) => edge?.node || edge);
    const contentIds = cartItems
      .map((item) => String(extractNumericId(item?.merchandise?.product?.id || item?.merchandise?.id) || ""))
      .filter(Boolean);
    const totalCartValue = cartItems.reduce((sum, item) => {
      const p = parseFloat(item?.merchandise?.price?.amount || item?.price || 0);
      const q = Number(item?.quantity) || 1;
      return sum + p * q;
    }, 0);

    // Track InitiateCheckout
    trackEvent("InitiateCheckout", {
      value: totalCartValue,
      currency: "INR",
      num_items: totalQuantity || formattedCart.item_count,
      content_ids: contentIds,
      checkout_type: "magic_checkout"
    });

    // 3. Request session from backend API
    const response = await fetch("/api/magic-checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: formattedCart,
        // Optional analytics for step 1.2
        analytics: {
          fbp: readCookie("_fbp"),
          fbc: readCookie("_fbc"),
          source_url: window.location.href,
          user_agent: navigator.userAgent,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data?.error || "Magic Checkout session creation failed";
      console.warn("[Magic Checkout Notice]:", errorMsg);

      // If store is not yet authorized or keys not configured, fall back to Shopify checkout seamlessly
      if (fallbackUrl) {
        console.log("Redirecting to standard Shopify checkout...");
        window.location.href = fallbackUrl;
        return;
      }
      throw new Error(errorMsg);
    }

    const { keyId, orderId, checkoutData } = data;
    const finalOrderId = orderId || checkoutData?.order_id;

    // 4. Configure Razorpay modal options
    const options = {
      key: keyId,
      order_id: finalOrderId,
      name: "NARA",
      description: "Order Checkout",
      image: "https://www.narawear.com/favicon.ico",
      show_coupons: true,
      prefill: {
        name: customerDetails.name || "",
        email: customerDetails.email || "",
        contact: customerDetails.phone || "",
        ...(couponCode ? { coupon_code: couponCode } : {}),
      },
      theme: {
        color: "#1F4A40", // NARA signature green (HEX only)
      },
      handler: async function (paymentResponse) {
        // Signature check on our server (logging/audit only — does not block order creation)
        fetch("/api/magic-checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentResponse),
        }).catch((verErr) => console.error("Signature verification error:", verErr));

        // Step 1.5: create the Shopify order via Razorpay Complete Checkout
        try {
          const orderResult = await completeShopifyCheckout(keyId, paymentResponse);
          toast.success("Order placed successfully!");

          // Track Purchase event with Meta Pixel & Analytics
          trackEvent("Purchase", {
            order_id: paymentResponse.razorpay_order_id,
            payment_id: paymentResponse.razorpay_payment_id,
            value: totalCartValue,
            currency: "INR",
            num_items: totalQuantity || formattedCart.item_count,
            content_ids: contentIds,
            checkout_type: "magic_checkout"
          });

          onSuccess(orderResult);
          if (orderResult?.order_status_url) {
            window.location.href = orderResult.order_status_url;
          }
        } catch (completeErr) {
          console.error("Complete checkout failed:", completeErr, paymentResponse);
          toast.error(
            `Payment received, but we couldn't confirm your order yet. Please contact support with payment ID ${paymentResponse.razorpay_payment_id}.`,
            { autoClose: false }
          );
          onError(completeErr);
        }
      },
      modal: {
        ondismiss: function () {
          console.log("Magic Checkout closed by customer.");
          trackEvent("checkout_abandoned", {
            step: "razorpay_modal",
            order_id: finalOrderId,
            value: totalCartValue,
            currency: "INR",
            content_ids: contentIds,
            reason: "dismissed"
          });
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (failResponse) {
      console.error("Razorpay payment failed:", failResponse.error);
      trackEvent("payment_failed", {
        order_id: finalOrderId,
        error_code: failResponse.error?.code,
        error_description: failResponse.error?.description,
        value: totalCartValue,
        currency: "INR"
      });
      toast.error(failResponse.error?.description || "Payment failed. Please try again.");
      onError(failResponse.error);
    });

    rzp.open();
    trackEvent("checkout_step_viewed", {
      step: "razorpay_modal",
      order_id: finalOrderId,
      value: totalCartValue,
      currency: "INR"
    });
  } catch (err) {
    console.error("Magic Checkout initiation error:", err.message);
    if (fallbackUrl) {
      console.log("Falling back to standard Shopify checkout:", fallbackUrl);
      window.location.href = fallbackUrl;
    } else {
      toast.error(err.message || "Failed to start checkout");
      onError(err);
    }
  }
};

