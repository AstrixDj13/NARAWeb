import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VideoLazy from "../loaders/VideoLazy";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fetchProducts } from "../../apis/getAllProducts";
import ProductCard from "../common/ProductCard";

const NewestArrivals = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 dark:text-gray-400">
          Loading newest arrivals...
        </p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 dark:text-gray-400">
          No new arrivals found.
        </p>
      </div>
    );
  }

  // Take the last 4 products from the fetched array
  const latestFour = products.slice(-4);

  return (
    <section id="newest-arrivals-section" className="bg-white pt-20 dark:!bg-black my-2">
      <div className="max-w-full mx-auto">
        <div className="text-left px-4 md:px-16 text-black dark:!text-white">
          <h2 className="text-xl md:text-3xl font-semibold italic tracking-widest uppercase">
            Newest Arrivals
          </h2>
          <p className="mt-2 text-[11px] lg:text-sm leading-8 font-mono tracking-widest sm:text-xl">
            Discover the latest additions to our collection
          </p>
          <Link to="/products">
            <button className="mt-3 bg-transparent hover:bg-green-700 text-green-900 dark:text-green-200 font-semibold font-mono py-2 px-4 border border-green-300 rounded">
              Shop all
            </button>
          </Link>
        </div>
        <div className="mt-6 md:mt-12 overflow-x-auto">
          <div className="flex lg:grid lg:grid-cols-4 md:grid-cols-3 gap-3 md:gap-2 pl-4">
            {latestFour.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewestArrivals;
