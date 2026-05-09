import { useState, useEffect, useRef } from "react";
import ProductItem from "../products/product-item";
import { fetchSixProductsfromCol } from "../../apis/Products";

const RelatedProducts = ({ collectionId, productId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [hasIntersected, setHasIntersected] = useState(false);
  const sectionRef = useRef(null);

  // Lazy load the products when the section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1200px" } // Triggers the load much earlier before scrolling into view
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasIntersected || !collectionId || !productId) return;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await fetchSixProductsfromCol(collectionId, productId);
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [hasIntersected, collectionId, productId]);

  return (
    <div
      ref={sectionRef}
      className="bg-[#f7f7f7] dark:bg-black dark:text-[#ffff] pt-12 pb-28 md:pb-12 overflow-hidden border-t dark:border-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="font-bold text-2xl md:text-3xl mb-8 tracking-tight">Related Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 sm:gap-x-4 md:gap-x-6">
          {isLoading || !hasIntersected ? (
            // Skeleton Loading
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="w-full h-[320px] sm:h-[360px] md:h-[380px] xl:h-[420px] bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                </div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductItem
                key={product.id}
                img={product?.variants?.nodes[0]?.image?.src}
                price={product?.variants?.nodes[0]?.price?.amount}
                name={product.title}
                productId={product.id}
                handle={product.handle}
                stockLeft={product?.metafield?.value}
              />
            ))
          )}
        </div>

        {!isLoading && hasIntersected && products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No related products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
