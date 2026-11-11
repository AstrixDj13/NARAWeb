import { toast } from "react-toastify";

/**
 * Dynamically loads the Razorpay checkout script
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
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

/**
 * Initiates Razorpay Magic Checkout with full fallback support.
 *
 * @param {Object} params
 * @param {string} params.cartId - Shopify cart ID
 * @param {Array} params.productsInCart - Array of cart item edges/nodes
 * @param {number} params.totalQuantity - Total number of items
 * @param {Object} [params.customerDetails] - Pre-filled customer info ({ name, email, phone })
 * @param {string} [params.fallbackUrl] - Standard Shopify checkout URL to redirect to if Magic Checkout is unavailable
 * @param {Function} [params.onSuccess] - Callback when payment completes successfully
 * @param {Function} [params.onError] - Callback on payment or session error
 */
export const initiateMagicCheckout = async ({
  cartId,
  productsInCart,
  totalQuantity,
  customerDetails = {},
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

    // 2. Prepare cart payload
    const formattedCart = formatCartForMagicCheckout(cartId, productsInCart, totalQuantity);
    if (!formattedCart.token || formattedCart.items.length === 0) {
      throw new Error("Your cart is empty or invalid.");
    }

    // 3. Request session from backend API
    const response = await fetch("/api/magic-checkout/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: formattedCart }),
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
      one_click_checkout: true,
      prefill: {
        name: customerDetails.name || "",
        email: customerDetails.email || "",
        contact: customerDetails.phone || "",
      },
      notes: {
        shopify_cart_id: cartId,
      },
      theme: {
        color: "#1F4A40", // NARA signature green
      },
      handler: async function (paymentResponse) {
        try {
          // Verify signature on backend
          await fetch("/api/magic-checkout/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentResponse),
          });

          toast.success("Payment completed successfully!");
          onSuccess(paymentResponse);
        } catch (verErr) {
          console.error("Signature verification error:", verErr);
          // Payment already succeeded on Razorpay, still trigger success flow
          onSuccess(paymentResponse);
        }
      },
      modal: {
        ondismiss: function () {
          console.log("Magic Checkout closed by customer.");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (failResponse) {
      console.error("Razorpay payment failed:", failResponse.error);
      toast.error(failResponse.error?.description || "Payment failed. Please try again.");
      onError(failResponse.error);
    });

    rzp.open();
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

