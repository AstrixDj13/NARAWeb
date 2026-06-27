import React, { useEffect, useState } from "react";
import NavbarUpdated from "../components/Navbar/NavbarUpdated";
import FooterSectionUpdated from "../components/home/FooterSectionUpdated";
import ProductItem from "../components/products/product-item";
import { useWishlist } from "../context/WishlistContext";
import api from "../utils/interceptors";
import Spinner from "../components/utils/Spinner";
import { Link } from "react-router-dom";
import WhatsAppButton from "../components/utils/WhatsAppButton";
import { useSelector } from "react-redux";

const WishlistPage = () => {
  const { wishlist, isInitialized } = useWishlist();
  const theme = useSelector((state) => state.app.theme);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!isInitialized) return;
      if (wishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const query = `
          query getWishlistProducts($ids: [ID!]!) {
            nodes(ids: $ids) {
              ... on Product {
                id
                title
                handle
                images(first: 5) {
                  nodes {
                    url
                  }
                }
                metafield(namespace: "custom", key: "stock_quantity") {
                  value
                }
                variants(first: 1) {
                  nodes {
                    id
                    image {
                      src
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        `;
        
        const response = await api.post('/', {
          query,
          variables: { ids: wishlist }
        });
        
        const fetchedProducts = response.data.data.nodes.filter(node => node !== null);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, isInitialized]);

  return (
    <>
      <NavbarUpdated />
      <div className={`min-h-[60vh] px-4 md:px-8 py-10 pt-28 ${theme === "dark" ? "text-white" : "text-black"}`}>
        <h1 className="text-3xl font-bold text-center mb-10">Your Wishlist</h1>
        
        {!isInitialized || isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => {
              const image = product.images?.nodes[0]?.url || "";
              const hoverImage = product.images?.nodes[1]?.url || image;
              const price = product.variants?.nodes[0]?.price?.amount || 0;
              
              return (
                <ProductItem
                  key={product.id}
                  productId={product.id}
                  name={product.title}
                  img={image}
                  price={price}
                  handle={product.handle}
                  stockLeft={product.metafield?.value}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 mt-10">
            <p className="text-lg text-gray-600 dark:text-gray-400">Your wishlist is currently empty.</p>
            <Link 
              to="/products"
              className="bg-black text-white dark:bg-white dark:text-black px-6 py-3 font-semibold tracking-wide hover:opacity-80 transition-opacity"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        )}
      </div>
      <WhatsAppButton />
      <FooterSectionUpdated />
    </>
  );
};

export default WishlistPage;
