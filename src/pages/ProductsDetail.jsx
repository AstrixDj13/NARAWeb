import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
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
import DeliveryDetails from "../components/productsDetail/DeliveryDetails";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../components/utils/PageLoader";
import useQuery from "../hooks/useQuery";
import RelatedProducts from "../components/productsDetail/RelatedProducts";
import ReviewSection from "../components/productsDetail/ReviewSection";
import TrustBadges from "../components/productsDetail/TrustBadges";
import ProductTicker from "../components/productsDetail/ProductTicker";
import { useProductScrollTracker, useEventTracker } from "../hooks/EventTracker";
import Coupons from "../components/Cart/Coupons";

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
  const location = useLocation();
  const preloadImageSrc = location.state?.imageSrc;

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
      setConcernedCollectionId(fetchedProduct.concernedCollectionId);
      setCollectionId(fetchedProduct.collectionId);
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

  const { trackEvent } = useEventTracker();

  // Track 'view_item' when product data finishes loading
  useEffect(() => {
    if (product && product.id) {
      const firstVariant = product?.variants?.edges?.[0]?.node;
      trackEvent('ViewContent', {
        product_id: product.id,
        variant_id: firstVariant?.id,
        product_name: product.title,
        price: firstVariant?.price?.amount || product?.priceRange?.minVariantPrice?.amount,
        collection: collectionId || concernedCollectionId,
        in_stock: firstVariant?.availableForSale || false
      });
    }
  }, [product?.id, trackEvent]);

  useProductScrollTracker(product?.id ? product : null);

  return (
    <>
      {product && product.title && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              name: product.title,
              image: product.images?.edges?.[0]?.node?.url,
              description: product.description,
              brand: {
                "@type": "Brand",
                name: "NARA",
              },
              offers: {
                "@type": "Offer",
                priceCurrency: product.priceRange?.minVariantPrice?.currencyCode || "INR",
                price: product.priceRange?.minVariantPrice?.amount,
                availability: product.variants?.edges?.[0]?.node?.availableForSale
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
                url: `https://narawear.com${location.pathname}`,
              },
            }),
          }}
        />
      )}
      {preloadImageSrc && (
        <img
          src={preloadImageSrc}
          alt="product-preload"
          style={{ display: "none" }}
          fetchpriority="high"
          loading="eager"
        />
      )}
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col bg-[#F7F7F7] dark:bg-black dark:text-[#ffff] font-antikor overflow-x-hidden w-full">
          <NavbarRelative />
          {/*Ticker appears only on product page*/}
          <ProductTicker />

          <div className="flex flex-col gap-1 md:gap-4 items-center justify-center xl:items-start xl:justify-center xl:flex-row dark:bg-black xl:!p-2 p-0 md:p-2 w-full overflow-x-hidden">
            {/* breadcrumb */}
            <div className="md:w-3/4 flex xl:hidden text-sm gap-4 font-outfit w-full overflow-hidden p-2 md:p-0">
              <Link className="underline flex items-center gap-3 shrink-0" to="/">
                Home{" "}
                <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
              </Link>
              <Link
                to={cameFrom.link}
                className="underline whitespace-nowrap flex items-center gap-3 shrink-0"
              >
                {cameFrom.page}{" "}
                <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
              </Link>
              <Link className="text-[#656565] whitespace-nowrap overflow-hidden text-ellipsis">
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

            <div className="xl:w-2/5 md:w-3/4 w-full flex flex-col gap-4 md:gap-8 pt-2 px-4 md:p-4 !pb-12 md:!px-8 xl:!pb-12 h-max">
              <div className="sticky top-[-1px] z-20 bg-[#F7F7F7] dark:bg-black py-2 xl:py-4 -mt-2 xl:-mt-4">
                <ActionButtons />
              </div>
              <DetailSection
                title={product.title}
                descriptionHtml={product.descriptionHtml}
                cameFrom={cameFrom}
                productId={product.id}
                worth={product.worth}
                isMelCollection={product?.collections?.edges?.some(e => e?.node?.title?.trim().toUpperCase() === "MEL")}
              >
                {/* Variants / Color Section */}
                <VariantsController
                  scrollToImageBySrc={scrollToImageBySrc}
                  colorsArray={product.colorsArray}
                  options={product.options}
                  variants={product.variants}
                  productId={product.id}
                />
                <DeliveryDetails />
              </DetailSection>

              <Coupons />

              <img
                className="w-full h-auto object-cover overflow-hidden"
                title="image"
                src="/dividers/star_divider.svg"
                alt=""
              />


              <TrustBadges />

            </div>
          </div>
        </div>
      )}
      <div id="reviews" className="w-full">
        <ReviewSection productId={product.id} />
      </div>
      {/* Related Products */}
      <RelatedProducts collectionId={concernedCollectionId} productId={product.id} />
    </>
  );
}