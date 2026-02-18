import axios from "axios";

// Fix checkout URL to use Shopify domain instead of custom domain
// This prevents React Router from catching the checkout URL
export const fixCheckoutUrl = (text) => {
  if (!text) return text;
  // Replace narawear.com with the actual Shopify checkout domain globally
  return text.replace(/http:\/\/narawear\.com/g, 'https://www.narawear.com')
    .replace(/https:\/\/narawear\.com/g, 'https://www.narawear.com');
};

export const gidToProductUrl = (gid, domain = "https://narawear.com/product/") => {
  if (!gid) return null;
  // Extract the ID part if needed, but the user's snippet just encoded the whole GID.
  // "create the product url from the gid://.......0614 using th function"
  // The user's function: const encoded = encodeURIComponent(gid); return `${domain}${encoded}`;
  // I will use exactly what the user provided.
  const encoded = encodeURIComponent(gid);
  return `${domain}${encoded}`;
};

const api = axios.create({
  baseURL: "https://72cbc9-6d.myshopify.com/api/2024-07/graphql.json",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN,
  },
});

export default api;
