import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "@mui/material";
import classes from "./DetailSection.module.css";
import { useEffect, useState } from "react";
import useQuery from "../../hooks/useQuery";
import { useOfferTag } from "../../hooks/useOfferTag";
import { campaigns, calculateTimeLeft } from "../../utils/campaignUtils";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { fetchReviews } from "../../apis/Reviews";

export default function DetailSection({ title, descriptionHtml, cameFrom, productId }) {
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
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

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

        <div className="flex items-center gap-3 my-1">
          <div className="text-2xl font-bold">{averageRating}</div>
          <div>
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{reviews?.length || 0} reviews</p>
          </div>
        </div>

        <h3 className="tracking-tight font-semibold text-xl flex items-center gap-2">
          {productOutOfStock ? (
            <span className="p-2 rounded-full text-white bg-red-500">
              out of stock
            </span>
          ) : currentVariant ? (
            <>
              <span className="line-through text-gray-500 text-base">
                {currentVariant?.node.price.currencyCode}{" "}
                {(parseFloat(currentVariant?.node.price.amount) + 200).toFixed(
                  2
                )}
              </span>
              <span>
                {currentVariant?.node.price.currencyCode +
                  " " +
                  parseFloat(currentVariant?.node.price.amount).toFixed(2)}
              </span>
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
        {offerTag && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 w-fit whitespace-nowrap">
              {offerTag}
            </div>
            <span className="text-red-600 text-xs font-bold">
              Hurry Up! Offer valid only for {formatTimeLeft()}
            </span>
          </div>
        )}
      </div>

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
              <p>We currently do not offer returns.</p>
              <p>However, we do offer exchanges within 14 days of purchase for:</p>
              <ul className="list-disc pl-5">
                <li>A different size, or</li>
                <li>A different product of equal value.</li>
              </ul>
              <p className="font-semibold mt-2">Conditions for exchange:</p>
              <ul className="list-disc pl-5">
                <li>The product must be unused and in its original condition</li>
                <li>All tags must be intact</li>
                <li>The item must not be washed or damaged</li>
              </ul>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                To request an exchange, please contact us at <a href="mailto:info@narawear.com" className="underline font-semibold">info@narawear.com</a> with your order number and exchange request details.
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

      {!productOutOfStock && (
        <div className="flex items-center gap-2 mt-4 mb-2 text-sm font-semibold text-gray-800 dark:text-gray-200">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          <span>In Stock, Ready to Ship</span>
        </div>
      )}
    </>
  );
}
