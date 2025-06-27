import { useState, useEffect } from "react";
import { BiSortAlt2 } from "react-icons/bi";
import { IoFilter, IoSearch } from "react-icons/io5";
import {
  kidProfuctFilter,
  menProfuctFilter,
  womenProfuctFilter,
} from "../../constants";
import ProductsSearch from "./products-search";

const sortByItems = {
  PriceAsc: false,
  PriceDsc: false,
  // RatingAsc: false,
  // RatingDsc: false
};

const sortItems = {
  PriceDsc: "Price: high to low",
  PriceAsc: "Price: low to high",
  // RatingAsc: "rating: low to high",
  // RatingDsc: "rating: high to low"
};

const ProductHeader = ({setIsLoading, products, setProducts, copyProducts }) => {
  const [filter, setFilter] = useState(false);
  const [sort, setSort] = useState(false);
  const [activeMenProducts, setActiveMenProducts] = useState(menProfuctFilter);
  const [activeWomenProducts, setActiveWomenProducts] =
    useState(womenProfuctFilter);
  const [activeKidsProducts, setActiveKidsProducts] =
    useState(kidProfuctFilter);
  const [activeFilterType, setActiveFilterType] = useState({
    women: true,
    men: false,
    kid: false,
  });
  const [sortBy, setSortBy] = useState(sortByItems);
  const [activeSortBy, setActiveSortBy] = useState("");

  const handleSort = (key) => {
    if (activeSortBy === key) {
      setProducts(copyProducts);
      setActiveSortBy("");
      setSort(false);
    } else {
      setActiveSortBy(key);
      setSortBy((prev) => ({ ...prev, [key]: !prev[key] }));

      const sortedProducts = [...products].sort((a, b) => {
        const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
        const priceB = parseFloat(b.priceRange.minVariantPrice.amount);

        // Sort logic for ascending and descending order
        if (key === "PriceAsc") {
          return priceA - priceB;
        } else if (key === "PriceDsc") {
          return priceB - priceA;
        }

        return 0;
      });

      setProducts(sortedProducts);
    }
  };

  const handleActiveFilter = (filter) => {
    const newFilterType = {
      women: filter === "women",
      men: filter === "men",
      kid: filter === "kid",
    };
    setActiveFilterType(newFilterType);
  };

  const handleActiveProductFilter = (product) => {
    if (activeFilterType.women) {
      setActiveWomenProducts((prev) => ({
        ...prev,
        [product]: !prev[product],
      }));
    } else if (activeFilterType.men) {
      setActiveMenProducts((prev) => ({
        ...prev,
        [product]: !prev[product],
      }));
    } else if (activeFilterType.kid) {
      setActiveKidsProducts((prev) => ({
        ...prev,
        [product]: !prev[product],
      }));
    }
  };

  const renderProducts = () => {
    let productFilter;
    if (activeFilterType.women) {
      productFilter = womenProfuctFilter;
    } else if (activeFilterType.men) {
      productFilter = menProfuctFilter;
    } else if (activeFilterType.kid) {
      productFilter = kidProfuctFilter;
    }

    return Object.keys(productFilter).map((key, index) => {
      const isActive =
        (activeFilterType.women && activeWomenProducts[key]) ||
        (activeFilterType.men && activeMenProducts[key]) ||
        (activeFilterType.kid && activeKidsProducts[key]);

      return (
        <div
          key={index}
          className={`dark:bg-black product-item font-mono flex items-center justify-between py-2 cursor-pointer px-2 rounded-md transition-colors duration-300 ${
            isActive ? "bg-[#67eacb]" : "hover:bg-[#67eacb]"
          }`}
          onClick={() => handleActiveProductFilter(key)}
        >
          <div>{key}</div>
          <div>
            {activeFilterType.women
              ? activeWomenProducts[key]
                ? "-"
                : "+"
              : activeFilterType.men
              ? activeMenProducts[key]
                ? "-"
                : "+"
              : activeKidsProducts[key]
              ? "-"
              : "+"}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex items-center justify-between flex-wrap md:flex-nowrap py-3 px-4 lg:px-12">
      {/* Product serach component */}
      <ProductsSearch
        products={products}
        originalProducts={copyProducts}
        className="md:hidden flex max-w-full"
        setProducts={setProducts}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default ProductHeader;
