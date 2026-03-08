import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import { getProductById, getProductByHandle } from "../apis/Products";
import Loading from "../components/utils/Loading";
import ImageGallery from "../components/productsDetail/ImageGallery";
import DetailSection from "../components/productsDetail/DetailSection";
import SizeSelector from "../components/productsDetail/SizeSelector";
import ActionButtons from "../components/productsDetail/ActionButtons";
import ColorSection from "../components/productsDetail/ColorSection";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FaPlus } from "react-icons/fa6";
import VariantsController from "../components/productsDetail/VariantsController";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../components/utils/PageLoader";
import useQuery from "../hooks/useQuery";
import RelatedProducts from "../components/productsDetail/RelatedProducts";
import ReviewSection from "../components/productsDetail/ReviewSection";
import TrustBadges from "../components/productsDetail/TrustBadges";
import ProductTicker from "../components/productsDetail/ProductTicker";

export default function ProductsDetailPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [sizes, setSizes] = useState({
    sizesAvailable: false,
    availableSizes: [],
    disabledSizes: [],
    defaultSize: 0,
  });
  const [defaultSize, setDefaultSize] = useState(null);
  const [defaultColor, setDefaultColor] = useState(null);
  const [availableColors, setAvailableColors] = useState(null);
  const query = useQuery();
  const [cameFrom, setCameFrom] = useState({ page: "", link: "" });

  const [modelInfo, setModelInfo] = useState([]);
  const params = useParams();
  const imageRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectionId, setCollectionId] = useState(null);
  const [concernedCollectionId, setConcernedCollectionId] = useState(null);

  const fetchProductInfoByHandle = async (handle) => {
    try {
      const fetchedProduct = await getProductByHandle(handle);
      setProduct(fetchedProduct);
      setConcernedCollectionId(fetchedProduct.concernedCollectionId);
      setCollectionId(fetchedProduct.collectionId);
      updateSizes(fetchedProduct);
      updateDefaultColorAndSize(fetchedProduct);
      updateColors(fetchedProduct);
      updateModelInfo(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product info by handle:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProductInfo = async (productId) => {
    try {
      const fetchedProduct = await getProductById(productId);
      setProduct(fetchedProduct);
      setConcernedCollectionId(fetchedProduct.concernedCollectionId); // Set the concerned collection ID
      setCollectionId(fetchedProduct.collectionId); // Assuming collectionId is part of the product data
      updateSizes(fetchedProduct);
      updateDefaultColorAndSize(fetchedProduct);
      updateColors(fetchedProduct);
      updateModelInfo(fetchedProduct);
    } catch (error) {
      console.error("Error fetching product info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSizes = (product) => {
    if (product.sizesAvailable) {
      const { availableSizes, disabledSizes, defaultSize } = product;
      setSizes({
        sizesAvailable: true,
        availableSizes,
        disabledSizes,
        defaultSize,
      });
    } else {
      setSizes({ sizesAvailable: false });
    }
  };

  const updateDefaultColorAndSize = (product) => {
    if (product.defaultColor) setDefaultColor(product.defaultColor);
    if (product.defaultSize) setDefaultSize(product.defaultSize);
  };

  const updateColors = (product) => {
    const colorOption = product?.options?.find((el) => el.name === "Color");
    const colors = colorOption?.values.map((el) => el.toLowerCase()) || [];
    console.log(colors);
    setAvailableColors(colors);
  };

  const updateModelInfo = (product) => {
    const modelOption = product.options.find((el) => el.name === "model");
    setModelInfo(modelOption?.values || []);
  };

  const scrollToImage = useCallback(
    (index) => {
      if (index >= 0 && index < product?.images?.edges?.length) {
        setCurrentIndex(index);
      }
    },
    [product]
  );

  const scrollToImageBySrc = useCallback(
    (imageSrc) => {
      const imageElementIndex = product?.images?.edges.findIndex(
        (edge) => edge.node.src === imageSrc
      );

      if (imageElementIndex !== -1) {
        setCurrentIndex(imageElementIndex);
      } else {
        console.warn(`Image with src ${imageSrc} not found.`);
      }
    },
    [product]
  );

  const handleUp = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDown = () => {
    if (product?.images?.edges && currentIndex < product.images.edges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    if (params.handle) {
      fetchProductInfoByHandle(params.handle);
    } else if (params.id) {
      fetchProductInfo(params.id);
    }
  }, [params.id, params.handle]);

  useEffect(() => {
    const camefrompage = query.get("camefrompage");
    if (camefrompage === "collection") {
      const collectionId = query.get("id");
      const title = query.get("title");
      setCameFrom({ page: title, link: `/collection?id=${collectionId}` });
    } else {
      setCameFrom({ page: camefrompage, link: `/${camefrompage}` });
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className=" flex flex-col bg-[#F7F7F7] dark:bg-black dark:text-[#ffff]  font-antikor xl-h-screen xl:max-h-screen lg:overflow-hidden">
          <NavbarRelative />

          <ProductTicker />

          <div className=" flex flex-col gap-4 items-center justify-center xl:items-start xl:justify-center xl:flex-row dark:bg-black xl:!p-2 p-2 ">
            {/* breadcrumb  */}
            <div className="md:w-3/4 flex xl:hidden text-sm gap-4 font-outfit w-full ">
              <Link className="underline flex items-center gap-3" to="/">
                Home{" "}
                <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
              </Link>
              <Link
                to={cameFrom.link}
                className="underline whitespace-nowrap flex items-center gap-3"
              >
                {cameFrom.page}{" "}
                <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
              </Link>
              <Link className="text-[#656565] whitespace-nowrap overflow-hidden text-ellipsis ">
                {product.title}
              </Link>
            </div>

            <ImageGallery
              images={product?.images?.edges}
              currentIndex={currentIndex}
              handleUp={handleUp}
              handleDown={handleDown}
              scrollToImage={scrollToImage}
              imageRefs={imageRefs}
            />

            <div className="xl:w-2/5 md:w-3/4 flex flex-col gap-8 p-4    !pb-12 !px-8 xl:overflow-auto xl:h-screen xl:!pb-36 scrollbar-hide ">
              <div className="sticky top-[-1px] z-20 bg-[#F7F7F7] dark:bg-black py-2 xl:py-4 -mt-2 xl:-mt-4">
                <ActionButtons />
              </div>
              <DetailSection
                title={product.title}
                descriptionHtml={product.descriptionHtml}
                cameFrom={cameFrom}
                productId={product.id}
              />



              {/* Color Section */}

              <VariantsController
                scrollToImageBySrc={scrollToImageBySrc}
                colorsArray={product.colorsArray}
                options={product.options}
                variants={product.variants}
                productId={product.id}
              />


              {/* <button onClick={()=>{

                toast(<CartToast />)
              }} className="bg-red-500 p-2 text-white">Click to view Toast</button>
              <ToastContainer hideProgressBar={true} closeButton={false} position="bottom-center" style={{backgroundColor: 0}} /> */}

              <img title="image" src="/dividers/star_divider.svg" alt="" />
              {/* Fabric Name Section */}
              {/* <div className="bg-[#D8E3B11C] border-2 border-[#D8E3B1] p-4 flex flex-col gap-4">
                        <div className="flex gap-4">
                          <img title="image" src="/test/star.svg" alt="" />
                          <h2 className="font-bold text-2xl">Fabric Name</h2>
                          <img title="image" src="/test/star.svg" alt="" />
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet consectetur adipisicing elit.
                          Incidunt doloribus eaque dicta sit architecto cum hic eum
                          dolore
                          <br />
                          explicabo possimus, enim quae nobis nemo soluta qui officia
                          aliquam alias! Quam!
                        </p>
                      </div> */}
              {/* Fabric Name section ends here */}

              <ReviewSection productId={product.id} />
              <TrustBadges />
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts collectionId={concernedCollectionId} productId={product.id} />
    </>
  );
}
