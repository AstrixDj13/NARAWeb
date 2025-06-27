import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VideoLazy from "../loaders/VideoLazy";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { fetchProducts } from "../../apis/getAllProducts";

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
              <div
                key={product.id}
                className="flex-shrink-0 w-[300px] sm:w-1/3 lg:w-full"
              >
                <Link to={`/product/${encodeURIComponent(product.id)}`}>
                  <div className="w-full bg-gray-200 min-h-[350px] relative overflow-hidden rounded-lg">
                    {product.mediaType === "video" ? (
                      <VideoLazy
                        src={product.mediaUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <LazyLoadImage
                        src={product.variants.nodes[0].image.src}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        width="100%"
                        height="100%"
                      />
                    )}
                    {product.badge && (
                      <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 py-1 px-2 rounded">
                        <span className="text-xs font-bold font-mono text-black">
                          {product.badge}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-medium font-mono text-black dark:!text-white">
                      {product.title}
                    </h3>
                    <p className="mt-1 text-sm font-light font-mono text-gray-800 dark:text-gray-200">
                      INR {product.variants.nodes[0].price.amount}0
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewestArrivals;
