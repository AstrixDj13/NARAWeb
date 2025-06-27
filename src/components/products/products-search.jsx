import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { searchProductsAPI } from "../../apis/Products";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProductsSearch = ({ setIsLoading, className, setProducts }) => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleSearchInput = (e) => {
    setIsLoading(true);
    setSearchInput(e.target.value);
    
    // Debounce the search
    if (debounceTimeout) clearTimeout(debounceTimeout);
    setDebounceTimeout(setTimeout(() => {
      handleSearch(e.target.value);
    }, 1500)); 
  };

  const handleSearch = async (input) => {
    if (input.trim().length === 0) {
      navigate(0);
      return;
    }
  
    try {
      setIsLoading(true);
      const products = await searchProductsAPI(input);
      
      if (Array.isArray(products)) {
        setProducts(products);
      } else {
        console.warn("Fetched products is not an array:", products);
        setProducts([]); // Clear the product list or handle object cases
      }
  
    } catch (error) {
      toast.error(error.message || "Error occurred");
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchInput);
    }
  };

  useEffect(() => {
    return () => {
      // Clean up the timeout on unmount
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  return (
    <div className={`px-2 border-2 gap-2 w-full mb-2 md:mb-0 border-[#ede9dd] ${className}`}>
      <div className="cursor-pointer flex items-center text-xl text-gray-500">
        <IoSearch onClick={() => handleSearch(searchInput)} />
      </div>
      <input
        className="outline-none py-2 w-full text-sm dark:bg-black dark:text-[#ffff]"
        placeholder="Search..."
        value={searchInput}
        onChange={handleSearchInput}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ProductsSearch;
