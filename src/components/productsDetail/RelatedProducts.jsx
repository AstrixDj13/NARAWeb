import { useState, useEffect } from "react";
import ProductItem from "../products/product-item";
import PageLoader from "../utils/PageLoader";
import { fetchFourProducts } from "../../apis/Products";

const RelatedProducts = () => {
  const colors = ["black", "brown", "beige", "gray"];
  const [activeProductColor, setActiveProductColor] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [copiedProducts, setCopiedProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsData = await fetchFourProducts();
        setProducts(productsData);
        setCopiedProducts(productsData); // Initialize copied products
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);



  return (
    
        <div className="bg-[#f7f7f7] dark:bg-black dark:text-[#ffff] xl:pt-12 pb-24 xl:pb-6 overflow-hidden min-h-screen ">
          <h1 className="p-4 font-bold text-3xl  ">Related Products </h1>
        {isLoading ? (
          <PageLoader  />
        ) : (
          
          <div className="flex flex-wrap gap-4 justify-center  py-4">
            
            {products.map((product, index) => (
              <ProductItem
                key={product.id}
                img={product?.variants?.nodes[0]?.image?.src}
                colors={colors}
                setActiveProductColor={setActiveProductColor}
                price={product?.variants?.nodes[0]?.price?.amount}
                name={product.title}
                discount={""}
                message={""}
                productId={product.id}
              />
            ))}

          </div>
        )}

        </div>
     
  );
};

export default RelatedProducts;