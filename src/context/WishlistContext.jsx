import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // 1. Initialize from local storage
    const local = localStorage.getItem('wishlist');
    let localWishlist = [];
    if (local) {
      try {
        localWishlist = JSON.parse(local);
        setWishlist(localWishlist);
      } catch (e) {
        console.error(e);
      }
    }
    
    // 2. Fetch from Shopify if logged in
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      fetchCustomerWishlist(accessToken, localWishlist);
    } else {
      setIsInitialized(true);
    }
  }, []);

  const fetchCustomerWishlist = async (token, localWishlist) => {
    try {
      const query = `
        query {
          customer(customerAccessToken: "${token}") {
            id
            metafield(namespace: "custom", key: "wishlist") {
              value
            }
          }
        }
      `;
      
      const storeUrl = import.meta.env.VITE_STORE_URL || 'narawear.myshopify.com';
      const storefrontToken = import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN;
      
      const res = await fetch(`https://${storeUrl.replace('https://','')}/api/2024-07/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': storefrontToken
        },
        body: JSON.stringify({ query })
      });
      
      const data = await res.json();
      const customer = data?.data?.customer;
      
      if (customer) {
        if (customer.id) {
          localStorage.setItem('user_id', customer.id);
        }
        
        let fetchedWishlist = [];
        if (customer.metafield?.value) {
           try {
             fetchedWishlist = JSON.parse(customer.metafield.value);
           } catch(e) {}
        }
        
        // Merge fetched with local
        const merged = Array.from(new Set([...fetchedWishlist, ...localWishlist]));
        
        setWishlist(merged);
        localStorage.setItem('wishlist', JSON.stringify(merged));
        
        // Sync back to backend if merged has items that weren't in Shopify
        if (merged.length !== fetchedWishlist.length) {
          syncToBackend(customer.id, merged);
        }
      }
    } catch (e) {
      console.error("Error fetching wishlist from Shopify:", e);
    } finally {
      setIsInitialized(true);
    }
  };

  const syncToBackend = async (userId, list) => {
    try {
      const baseUrl = import.meta.env.VITE_EVENT_API_URL || "http://localhost:3001";
      await fetch(`${baseUrl}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, wishlist: list })
      });
    } catch (e) {
      console.error("Error syncing wishlist to backend:", e);
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newList = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      localStorage.setItem('wishlist', JSON.stringify(newList));
      
      const userId = localStorage.getItem('user_id');
      if (userId) {
        syncToBackend(userId, newList);
      }
      
      return newList;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInitialized }}>
      {children}
    </WishlistContext.Provider>
  );
};
