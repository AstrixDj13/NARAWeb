import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";
import { getCollections, getCollectionById } from "../../apis/Collections";

const Spotlight = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        // Step 1: Get all collections (id + title only)
        const collections = await getCollections();

        const bestsellersCollection = collections.find(
          (col) => col.title.toLowerCase() === "bestsellers"
        );

        if (!bestsellersCollection) {
          console.warn("Bestsellers collection not found");
          setProducts([]);
          setIsLoading(false);
          return;
        }

        // Step 2: Fetch the actual products for that collection
        const { products: collectionProducts } = await getCollectionById(
          bestsellersCollection.id
        );

        const topProducts = collectionProducts.slice(0, 4).map((product) => ({
          ...product,
          imgSrc: product.imageSrc,  // ProductCard uses imgSrc, not imageSrc
          label: "Best seller",
        }));

        setProducts(topProducts);
      } catch (error) {
        console.error("Failed to fetch bestsellers:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestsellers();
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
          <h2 className="text-xl md:text-3xl font-semibold italic tracking-widest uppercase">
            Our Bestsellers!
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
                <ProductCard key={product.productId} product={product} />
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