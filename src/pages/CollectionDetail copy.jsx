import { Link } from "react-router-dom";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import ProductItem from "../components/products/product-item";
import CollectionProductItem from "../components/Collection/CollectionProduct-Item";
import { useEffect } from "react";
import { getCollectionById } from "../apis/Collections";

export default function CollectionDetail() {
  const fetchCollectionProducts = async () => {
    try {
      const response = await getCollectionById();
      console.log("collection products: ", response);
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
      <main className="bg-[#F7F7F7] lg:h-[calc(100vh-4em)] flex lg:flex-row flex-col justify-center lg:justify-start items-center lg:items-start lg:!pt-16 pt-4 lg:gap-0 gap-12 font-antikor">
        {/* sidebar */}

        <div className="  lg:w-1/3 w-full sm:w-3/4 md:w-1/2 xl:px-12 px-6 flex flex-col gap-8 overflow-auto">
          <div className="flex gap-2 items-center text-[#656565]">
            <Link className="underline ">Home</Link>
            <img
              title="image"
              className="-mt-1"
              src="/public/icons/leftTriangleIcon.svg"
              alt="icon"
            />
            <span>Circa 295</span>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm">Featured Collection, 2024</h2>
            <h1 className="text-5xl">मेल</h1>
          </div>

          <div className="tracking-tighter flex flex-col gap-2 ">
            <h1 className="font-black ">[m-el] verb. Hindi</h1>
            <p className="fon-bold">
              A match, accordance, adjustment, affinity, blend .
              <br />
              <br />
              A serious attempt to blen lore d what was once quintessential for
              one’s wardrobe with what we now believe epitomises ideal sense of
              style .
              <br />
              <br />
              In it’s true essence, a source of an escape to an almost forgotten
              culture while also incorporating the modish
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="lg:w-3/4 lg:h-[calc(100vh-4em)] lg:pb-36 w-full sm:w-3/4 md:w-1/2 grid lg:grid-cols-2 grid-cols-1 gap-x-12 gap-y-12 lg:!overflow-auto px-6 justify-items-center">
          <div className="w-full">
            <CollectionProductItem
              img="https://cdn.shopify.com/s/files/1/0713/4265/3695/files/MG_5497.jpg?v=1726065829"
              price={4500}
              name={"Raglon mini panelled dress"}
              productId={"product.id"}
            />
          </div>

          <div className="lg:mt-10 w-full">
            <CollectionProductItem
              img="https://cdn.shopify.com/s/files/1/0713/4265/3695/files/MG_5497.jpg?v=1726065829"
              price={4500}
              name={"Raglon mini panelled dress"}
              productId={"product.id"}
            />
          </div>

          <div className="w-full">
            <CollectionProductItem
              img="https://cdn.shopify.com/s/files/1/0713/4265/3695/files/MG_5497.jpg?v=1726065829"
              price={4500}
              name={"Raglon mini panelled dress"}
              productId={"product.id"}
            />
          </div>

          <div className="lg:mt-10 w-full">
            <CollectionProductItem
              img="https://cdn.shopify.com/s/files/1/0713/4265/3695/files/MG_5497.jpg?v=1726065829"
              price={4500}
              name={"Raglon mini panelled dress"}
              productId={"product.id"}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
