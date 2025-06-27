import { useState, useEffect, useRef } from "react";
import { fetchProducts } from "../apis/getAllProducts";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import ProductHeader from "../components/products/header";
import ProductItem from "../components/products/product-item";
import PageLoader from "../components/utils/PageLoader";

const Products = () => {
  const colors = ["black", "brown", "beige", "gray"];
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [copiedProducts, setCopiedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 50; // Show 12 products per page
  const containerRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await fetchProducts();
        setProducts(productsData);
        setCopiedProducts(productsData);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const reversedProducts = [...products].reverse();

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = reversedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(reversedProducts.length / productsPerPage);

  // Scroll to top when page changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  const goToNextPage = () => {
    setIsLoading(true);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
    setIsLoading(false);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="dark:!bg-black p-[0.2px] overflow-x-hidden xl:h-screen">
      <NavbarRelative />
      <div className="dark:!bg-black bg-[#ffff] dark:text-[#ffff] mt-8">
        <div className="bg-[#F7F7F7] dark:bg-black dark:border-b-[#ffff] dark:border-b-2 pb-2 mt-20">
          <ProductHeader
            setIsLoading={setIsLoading}
            products={products}
            setProducts={setProducts}
            copyProducts={copiedProducts}
          />
        </div>
        <div
          ref={containerRef}
          className="overflow-y-auto min-h-screen scroll-smooth"
        >
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="flex flex-wrap gap-4 justify-center py-4">
              {currentProducts.length === 0 ? (
                <h1 className="text-3xl text-center p-12">
                  Could not get any product for you!
                </h1>
              ) : (
                currentProducts.map((product, index) => (
                  <ProductItem
                    key={index}
                    img={resizeShopifyImage(
                      product?.variants?.nodes[0]?.image?.src
                    )}
                    colors={colors}
                    price={product?.variants?.nodes[0]?.price?.amount}
                    name={product.title}
                    discount={""}
                    message={""}
                    productId={product.id}
                  />
                ))
              )}
            </div>
          )}
          {/* Pagination Controls */}
          {reversedProducts.length > productsPerPage && (
            <div className="flex justify-center items-center gap-6 py-6">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-lg font-semibold dark:text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function resizeShopifyImage(url, size = "600x600") {
  if (!url) return "";

  const lastDotIndex = url.lastIndexOf(".");
  if (lastDotIndex === -1) return url;

  const name = url.substring(0, lastDotIndex);
  const extension = url.substring(lastDotIndex);

  return `${name}_${size}${extension}`;
}

export default Products;
