import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import classes from "./DetailSection.module.css";
import { useEffect, useState, useMemo } from "react";
import useQuery from "../../hooks/useQuery";
import { useOfferTag } from "../../hooks/useOfferTag";
import { campaigns, calculateTimeLeft } from "../../utils/campaignUtils";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { fetchReviews } from "../../apis/Reviews";

export default function DetailSection({ title, descriptionHtml, cameFrom, productId, worth, isMelCollection, children }) {
  const theme = useSelector((state) => state.app.theme);
  const currentVariant = useSelector(
    (state) => state.activeProduct.currentVariant
  );
  const productOutOfStock = useSelector(
    (state) => state.activeProduct.outOfStock
  );
  const offerTag = useOfferTag(productId);
  const [timeLeft, setTimeLeft] = useState({});
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isWorthOpen, setIsWorthOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  let worthTitle = "";
  let worthContent = "";
  if (worth) {
    // Match everything up to the price (e.g., ₹899, ₹999) as the title, and the rest as content.
    // Use [\s\S] to match across newlines which may be present in the Shopify metafield.
    const match = worth.match(/^(.*?₹[\d.,]+)\s+([\s\S]*)$/);
    if (match) {
      worthTitle = match[1];
      worthContent = match[2];
    } else {
      // Fallback: split on any whitespace (including newlines)
      const worthWords = worth.split(/\s+/);
      if (worthWords.length > 5) {
        worthTitle = worthWords.slice(0, 5).join(" ");
        worthContent = worthWords.slice(5).join(" ");
      } else {
        worthTitle = worth;
      }
    }
  }
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const [randomCartCount, setRandomCartCount] = useState(7);

  useEffect(() => {
    if (!productId) return;

    const updateCount = () => {
      const now = new Date();
      const dateString = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
      const currentHour = now.getHours();

      let hash = 0;
      const str = String(productId) + "-" + dateString;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }

      const baseCount = (Math.abs(hash) % 9) + 1;
      setRandomCartCount(baseCount + currentHour);
    };

    updateCount();
    const interval = setInterval(updateCount, 60000);
    return () => clearInterval(interval);
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews(productId).then(data => setReviews(data || []));
    }
  }, [productId]);

  const averageRating = reviews?.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  useEffect(() => {
    if (!offerTag) return;

    // Normalize strings for comparison (remove spaces and lowercase)
    const normalize = (str) => str.replace(/\s+/g, "").toLowerCase();
    const campaign = campaigns.find(
      (c) => normalize(c.offerTag) === normalize(offerTag)
    );

    if (!campaign) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(campaign.targetDate));
    }, 1000);

    setTimeLeft(calculateTimeLeft(campaign.targetDate));

    return () => clearInterval(timer);
  }, [offerTag]);

  const formatTimeLeft = () => {
    if (
      !timeLeft.days &&
      !timeLeft.hours &&
      !timeLeft.minutes &&
      !timeLeft.seconds
    ) {
      return "";
    }

    const dayLabel = timeLeft.days === 0 ? "Day" : "Days";
    return `${timeLeft.days + 1} ${dayLabel}`;
  };


  return (
    <>
      <div className="flex flex-col xl:!gap-3 gap-1 ">
        {/* Breadcrumb */}
        <div className="hidden xl:flex gap-4 font-outfit">
          <Link className="underline flex items-center gap-3 " to="/">
            Home <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
          </Link>
          <Link
            to={cameFrom.link}
            className="underline flex items-center gap-3 "
          >
            {cameFrom.page}{" "}
            <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
          </Link>
          <Link className="text-[#656565]">{title?.slice(0, 20)}...</Link>
        </div>

        <h2 className="font-black xl:text-2xl text-xl"> {title}</h2>{" "}
        {/*{product?.title}*/}

        {/*<div
          className="flex items-center gap-3 my-1 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            const el = document.getElementById('reviews');
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 100; // Offset for navbar
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}
        >
          <div className="text-2xl font-bold">{averageRating}</div>
          <div>
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{reviews?.length || 0} reviews</p>
          </div>
        </div>*/}

        <h3 className="tracking-tight font-semibold text-xl flex items-center gap-2">
          {productOutOfStock ? (
            <span className="p-2 rounded-full text-white bg-red-500">
              out of stock
            </span>
          ) : currentVariant ? (
            <>
              <span className="line-through text-gray-500 text-base">
                {currentVariant?.node.price.currencyCode}{" "}
                {isMelCollection
                  ? parseFloat(currentVariant?.node.price.amount).toFixed(2)
                  : (parseFloat(currentVariant?.node.price.amount) + 200).toFixed(2)
                }
              </span>
              <span>
                {currentVariant?.node.price.currencyCode +
                  " " +
                  (isMelCollection
                    ? (parseFloat(currentVariant?.node.price.amount) * 0.70).toFixed(2)
                    : parseFloat(currentVariant?.node.price.amount).toFixed(2))}
              </span>
              {/* 30% OFF tag removed as requested */}
            </>
          ) : (
            <Skeleton
              variant="rectangular"
              className="w-full h-auto p-2 dark:bg-white"
            />
          )}
        </h3>
        <span className="text-xs tracking-tighter capitalize">
          (Incl. of all taxes)
        </span>
        {!productOutOfStock && (
          <div className="overflow-hidden w-full mt-1">
            <div className={`text-red-600 text-sm font-bold ${classes.slideInRight}`}>
              <span className="animate-pulse inline-block">
                {randomCartCount} people added this to cart today !!!
              </span>
            </div>
          </div>
        )}
        {offerTag && !productOutOfStock && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 w-fit whitespace-nowrap">
              {offerTag}
            </div>
            <span className="text-red-600 text-xs font-bold">
              {formatTimeLeft() ? `Hurry Up! Offer valid only for ${formatTimeLeft()}` : "Selling Fast Today!"}
            </span>
          </div>
        )}
        {!productOutOfStock && (
          <div className="flex items-center gap-2 mt-2 mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span>In Stock, Ready to Ship</span>
          </div>
        )}
      </div>

      {children}

      <div className="mt-6 flex flex-col border-t border-gray-200 dark:border-gray-800">
        {/* Description HTML section */}
        <div className="flex flex-col border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="flex justify-between items-center w-full focus:outline-none py-4"
          >
            <h2 className="font-bold">Description</h2>
            {isDescriptionOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
          </button>
          {isDescriptionOpen && (
            <div
              className={`dark:text-white text-sm pb-4`}
              dangerouslySetInnerHTML={{
                __html: descriptionHtml,
              }}
            ></div>
          )}
        </div>

        {/* Worth Section */}
        {worth && (
          <div className="flex flex-col border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setIsWorthOpen(!isWorthOpen)}
              className="flex justify-between items-center w-full focus:outline-none py-4"
            >
              <h2 className="font-bold">{worthTitle}</h2>
              {isWorthOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
            </button>
            {isWorthOpen && (
              <ul className="dark:text-white text-sm pb-4 list-disc pl-5 space-y-1">
                {worthContent
                  .split(/[\.\n]+/)
                  .map(item => item.trim())
                  .filter(item => item.length > 0)
                  .map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))
                }
              </ul>
            )}
          </div>
        )}

        {/* Return & Exchange Policy Section */}
        <div className="flex flex-col border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setIsReturnOpen(!isReturnOpen)}
            className="flex justify-between items-center w-full focus:outline-none py-4"
          >
            <h2 className="font-bold">Return & Exchange Policy</h2>
            {isReturnOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
          </button>
          {isReturnOpen && (
            <div className="dark:text-white text-sm pb-4 space-y-2">
              <p>We accept returns and exchanges within <span className="font-bold text-[#1E7B74]">10 days</span> of delivery.</p>

              <div className="mt-2 space-y-1">
                <p className="font-semibold text-[#1E7B74]">Returns:</p>
                <p>A ₹99 return fee will be deducted from your refund to cover reverse logistics.</p>
              </div>

              <div className="mt-2 space-y-1">
                <p className="font-semibold text-[#1E7B74]">Exchanges:</p>
                <p>We offer exchanges for a different size or a different product of equal value.</p>
              </div>

              <p className="font-semibold mt-4">Conditions:</p>
              <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400">
                <li>The product must be unused and in its original condition</li>
                <li>All tags must be intact</li>
                <li>The item must not be washed or damaged</li>
              </ul>
              <p className="mt-4 text-xs">
                To request a return or exchange, please contact us at <a href="mailto:info@narawear.com" className="underline font-semibold text-[#1E7B74]">info@narawear.com</a>.
              </p>
            </div>
          )}
        </div>

        {/* Delivery Timeline Section */}
        <div className="flex flex-col border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
            className="flex justify-between items-center w-full focus:outline-none py-4"
          >
            <h2 className="font-bold">Delivery Timeline</h2>
            {isDeliveryOpen ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
          </button>
          {isDeliveryOpen && (
            <div className="dark:text-white text-sm pb-4 space-y-2">
              <p>Orders are dispatched within 24–48 hours of confirmation.</p>
              <p>Once dispatched, delivery typically takes 4–5 business days, depending on your location.</p>
              <p>You will receive a tracking link via email or SMS once your order has been shipped.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
