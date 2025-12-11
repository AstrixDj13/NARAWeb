import axios from "axios";

// Fix checkout URL to use Shopify domain instead of custom domain
// This prevents React Router from catching the checkout URL
export const fixCheckoutUrl = (url) => {
  if (!url) return url;
  // Replace narawear.com with the actual Shopify checkout domain
  return url.replace('http://narawear.com', 'https://narawear.myshopify.com')
    .replace('https://narawear.com', 'https://narawear.myshopify.com');
};

const api = axios.create({
  baseURL: "https://72cbc9-6d.myshopify.com/api/2024-07/graphql.json",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN,
  },
});

export default api;
