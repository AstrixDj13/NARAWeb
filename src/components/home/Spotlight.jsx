import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import { fetchProducts } from "../../apis/getAllProducts";

const Spotlight = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // IDs of the products to show in Spotlight
  const spotlightIds = [
    "gid://shopify/Product/8756899709142", // Laidback Luxe Co-ord Set
    "gid://shopify/Product/8756898365654", // The Out of the Office Co-ord set
    "gid://shopify/Product/8756897644758", // The Red on the Run Co-ord set
    "gid://shopify/Product/8756895383766", // The June Co-ord set
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const allProducts = await fetchProducts();

        // Filter products that match the spotlight IDs
        const spotlightProducts = allProducts.filter(product =>
          spotlightIds.includes(product.id)
        );

        // If we found the products, use them. 
        // Note: The order might depend on the API response, so we might want to sort them to match the original order if important.
        // For now, we'll just use the filtered list.

        // Map to ensure they have the 'label' property which was hardcoded before
        const mappedProducts = spotlightProducts.map(product => {
          // Add custom labels based on ID if needed, or just use a generic one
          // The original hardcoded data had "Best seller" for all.
          return {
            ...product,
            label: "Best seller"
          };
        });

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to load spotlight products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white dark:!bg-black">
        <p className="text-gray-500 dark:text-gray-400">
          Loading spotlight...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white pt-20 dark:!bg-black">
      <div className="max-w-full mx-auto">
        <div className="text-left px-4 md:px-16 text-black dark:!text-white">
          <h2 className="text-xl md:text-3xl font-semibold  italic tracking-widest uppercase">
            In the spotlight!
          </h2>
          <p className="mt-2 text-[11px] lg:text-sm leading-8 font-mono tracking-widest sm:text-xl">
            Look what people are loving the most this season
          </p>
          <Link to={"/products"}>
            <button className="mt-3 bg-transparent hover:bg-gray-700 text-[#1F4A40] dark:!text-[#D8E3B1] font-semibold font-mono py-2 px-4 border border-[#B5B5B5]">
              View all
            </button>
          </Link>
        </div>
        <div className="mt-6 md:mt-12 overflow-x-scroll testimonial-container">
          <div className="flex lg:grid lg:grid-cols-4 md:grid-cols-3 gap-3 md:gap-2 pl-4">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
                <p className="text-gray-500">No spotlight products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spotlight;
