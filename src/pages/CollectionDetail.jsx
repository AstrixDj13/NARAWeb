import { Link } from "react-router-dom";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import ProductItem from "../components/products/product-item";
import CollectionProductItem from "../components/Collection/CollectionProduct-Item";
import { useEffect, useState } from "react";
import { getCollectionById } from "../apis/Collections";

import { useLocation } from "react-router-dom";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function CollectionDetail() {
  const [collection, setCollection] = useState({
    title: "N/A",
    descriptionHtml: "N/A",
  });
  const [collectionProducts, setCollectionProducts] = useState([]);
  const query = useQuery();

  const fetchCollectionProducts = async () => {
    try {
      const response = await getCollectionById(query.get("id"));
      setCollection(response.collectionDetail);
      setCollectionProducts(response.products);
    } catch (error) {
      console.error(error);
      // have to handle errors more gracefully!
    }
  };

  useEffect(() => {
    fetchCollectionProducts();
  }, []);
  return (
    <div className="lg:h-[100vh] lg:!overflow-hidden overflow-auto ">
      <header className="h-[4em]">
        <NavbarRelative />
      </header>
      <main className="bg-[#F7F7F7] dark:bg-black dark:text-[#ffff] lg:h-[calc(100vh-4em)] flex lg:flex-row flex-col justify-center lg:justify-start items-center lg:items-start lg:!pt-16 pt-4 lg:gap-0 gap-12 font-antikor">
        {/* sidebar */}

        <div className="h-full  lg:w-1/3 w-full sm:w-3/4 md:w-1/2 xl:px-12 px-6 flex flex-col gap-8 overflow-auto scrollbar-hide">
          <div className="flex gap-2 items-center text-[#656565]">
            <Link to={"/"} className="underline ">
              Home
            </Link>
            <img
              title="image"
              className="-mt-1"
              src="/icons/leftTriangleIcon.svg"
              alt=""
            />
            <span>
              {collection.title.slice(0, 11)}
              {collection.title.length > 11 ? "..." : null}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm">Featured Collection</h2>
            <h1 className="text-5xl">{collection.title}</h1>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: collection.descriptionHtml }}
            className="tracking-tighter flex flex-col gap-2 "
          ></div>
        </div>
        {/* Products */}
        <div className="lg:w-3/4 lg:h-[calc(100vh-4em)] lg:pb-36 w-full sm:w-3/4 md:w-1/2 grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-12 lg:!overflow-auto px-6 justify-items-center">
          {collectionProducts.map((product, index) => {
            return (
              <div
                key={product.productId}
                className={index % 2 == 0 ? "w-full" : "lg:mt-10 w-full"}
              >
                <CollectionProductItem
                  img={product.imageSrc}
                  price={product.price}
                  name={product.title}
                  productId={product.productId}
                  cameFromLink={`/collection?id=${query.get("id")}`}
                  collectionTitle={collection.title}
                  collectionId={query.get("id")}
                />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
