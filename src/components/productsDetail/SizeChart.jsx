import React, { useEffect, useState } from "react";
import { getCollections, getCollectionById } from "../../apis/Collections";
import { IoClose } from "react-icons/io5";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import {
  ADAA_SIZE_GUIDE,
  isAdaaProduct,
  isAdaaCollectionTitle,
  getFitFabricDetails,
} from "../../constants/sizeGuides";

export default function SizeChart({ productId, product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState("in"); // "in" | "cm"
  const [howToMeasureOpen, setHowToMeasureOpen] = useState(false);

  // ADAA detection
  const [isAdaa, setIsAdaa] = useState(() => isAdaaProduct(product));

  // Fit & Fabric details from product metafields
  const fitFabric = getFitFabricDetails(product);

  const whatsappMessage = product?.title
    ? `Hi NARA Team, I need help finding my best fit for ${product.title}.`
    : "Hi NARA Team, I need help finding my best fit.";
  const whatsappUrl = `https://wa.me/919326472754?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // Legacy fallback states for non-ADAA collections
  const [showTops, setShowTops] = useState(false);
  const [showBottoms, setShowBottoms] = useState(false);
  const [showMenTops, setShowMenTops] = useState(false);
  const [loading, setLoading] = useState(true);

  // Update isAdaa if product prop changes
  useEffect(() => {
    if (product) {
      const match = isAdaaProduct(product);
      if (match) {
        setIsAdaa(true);
        setLoading(false);
        return;
      }
    }
  }, [product]);

  // Lock body scroll when drawer/modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  // Check collections if not immediately resolved via product prop
  useEffect(() => {
    const checkCollections = async () => {
      // If already identified as ADAA via product prop, skip fetching
      if (isAdaaProduct(product)) {
        setIsAdaa(true);
        setLoading(false);
        return;
      }

      if (!productId && !product?.id) {
        setLoading(false);
        return;
      }

      const targetId = productId || product?.id;

      try {
        const collections = await getCollections();

        // 1. Check if product belongs to ADAA - The Festive Edit collection
        const adaaCollection = collections.find((c) =>
          isAdaaCollectionTitle(c.title)
        );

        if (adaaCollection) {
          try {
            const { products } = await getCollectionById(adaaCollection.id);
            const inAdaa = products.some(
              (p) => p.productId === targetId || p.id === targetId
            );
            if (inAdaa) {
              setIsAdaa(true);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("Error fetching ADAA collection products:", e);
          }
        }

        // 2. Legacy fallback for other collections
        const relevantCollections = collections.filter((c) =>
          ["Tops", "Bottoms", "Co-ord sets", "Men's Top"].includes(c.title)
        );

        let isTop = false;
        let isBottom = false;
        let isMenTop = false;

        for (const collection of relevantCollections) {
          const { products } = await getCollectionById(collection.id);
          const productInCollection = products.some(
            (p) => p.productId === targetId || p.id === targetId
          );

          if (productInCollection) {
            if (collection.title === "Tops") isTop = true;
            if (collection.title === "Bottoms") isBottom = true;
            if (collection.title === "Men's Top") isMenTop = true;
            if (collection.title === "Co-ord sets") {
              isTop = true;
              isBottom = true;
            }
          }
        }

        setShowTops(isTop);
        setShowBottoms(isBottom);
        setShowMenTops(isMenTop);
      } catch (error) {
        console.error("Error checking size chart collections:", error);
      } finally {
        setLoading(false);
      }
    };

    checkCollections();
  }, [productId, product]);

  // Convert measurement based on active unit
  const formatValue = (inchesVal) => {
    if (inchesVal === undefined || inchesVal === null) return "-";
    if (unit === "in") return inchesVal;
    // 1 inch = 2.54 cm, rounded to nearest whole number
    return Math.round(Number(inchesVal) * 2.54);
  };

  // Legacy data sets
  const legacyTopsData = [
    { label: "Chest", xs: "34", s: "36", m: "38", l: "40" },
    { label: "Waist", xs: "28", s: "30", m: "32", l: "34" },
    { label: "Hip", xs: "38", s: "40", m: "42", l: "44" },
  ];

  const legacyBottomsData = [
    { label: "Waist", xs: "26", s: "28", m: "30", l: "32" },
    { label: "Hip", xs: "36", s: "38", m: "40", l: "42" },
    { label: "Thigh", xs: "24", s: "25", m: "26", l: "27" },
    { label: "Side", xs: "42", s: "42", m: "42.5", l: "42.5" },
  ];

  const legacyMenTopsData = [
    { label: "Chest", s: "39.5", m: "41.75", l: "45", xl: "47.5", xxl: "50.5" },
    { label: "Length", s: "27", m: "28", l: "29", xl: "30", xxl: "30.63" },
    { label: "Shoulder", s: "17", m: "18", l: "19", xl: "20", xxl: "21.5" },
    { label: "Sleeve", s: "25", m: "25.5", l: "26", xl: "26.88", xxl: "27.13" },
  ];

  const legacyDefaultColumns = [
    { header: "XS", key: "xs" },
    { header: "S", key: "s" },
    { header: "M", key: "m" },
    { header: "L", key: "l" },
  ];

  const legacyMenColumns = [
    { header: "S", key: "s" },
    { header: "M", key: "m" },
    { header: "L", key: "l" },
    { header: "XL", key: "xl" },
    { header: "XXL", key: "xxl" },
  ];

  const LegacyTable = ({ title, data, columns }) => (
    <div className="mb-6">
      {title && (
        <h3 className="text-center text-lg mb-3 font-semibold text-gray-900 dark:!text-white">
          {title}
        </h3>
      )}
      <div className="overflow-hidden border border-gray-300 dark:!border-neutral-700 rounded-lg">
        <table className="w-full text-center border-collapse bg-white dark:!bg-[#1F1F1F]">
          <thead>
            <tr className="bg-[#1F4A40] text-white">
              <th className="py-2.5 px-2 border-r border-b border-gray-300 dark:!border-neutral-700 font-semibold uppercase text-xs">
                SIZE
                <div className="text-[10px] font-normal normal-case leading-none mt-0.5">
                  (in inches)
                </div>
              </th>
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  className={`py-2.5 px-2 border-b border-gray-300 dark:!border-neutral-700 font-semibold uppercase text-xs ${
                    index !== columns.length - 1 ? "border-r" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-800 dark:!text-neutral-200 text-sm">
            {data.map((row, rowIndex) => (
              <tr
                key={row.label}
                className="hover:bg-gray-50 dark:hover:!bg-neutral-800/50"
              >
                <td
                  className={`py-2.5 px-2 font-medium border-r border-gray-300 dark:!border-neutral-700 text-gray-900 dark:!text-white ${
                    rowIndex !== data.length - 1 ? "border-b" : ""
                  }`}
                >
                  {row.label}
                </td>
                {columns.map((col, colIndex) => (
                  <td
                    key={col.key}
                    className={`py-2.5 px-2 ${
                      colIndex !== columns.length - 1
                        ? "border-r border-gray-300 dark:!border-neutral-700"
                        : ""
                    } ${
                      rowIndex !== data.length - 1
                        ? "border-b border-gray-300 dark:!border-neutral-700"
                        : ""
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // If loading or not part of any size chart collection, do not render
  if (loading) return null;
  if (!isAdaa && !showTops && !showBottoms && !showMenTops) return null;

  const isCoords = showTops && showBottoms;

  return (
    <>
      {/* Trigger Button on Product Page */}
      <button
        onClick={() => {
          setHowToMeasureOpen(false);
          setIsOpen(true);
        }}
        className="text-xs sm:text-sm font-medium flex items-center gap-1.5 text-gray-700 dark:!text-neutral-300 hover:text-black dark:hover:!text-white transition-colors underline underline-offset-4 cursor-pointer"
        title="View Size Guide"
        type="button"
      >
        <svg
          className="w-4 h-4 text-gray-700 dark:!text-neutral-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span>Size Guide</span>
      </button>

      {/* Centered Modal Popup */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl md:max-w-2xl max-h-[88vh] bg-white dark:!bg-[#181818] text-gray-900 dark:!text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-transparent dark:!border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 pb-4 border-b border-gray-100 dark:!border-neutral-800 bg-white dark:!bg-[#181818]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-gray-900 dark:!text-white">
                    {isAdaa ? ADAA_SIZE_GUIDE.title : "Size Guide"}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Inches / Centimeters Toggle Pill */}
                  {isAdaa && (
                    <div className="inline-flex items-center bg-[#F1F1F3] dark:!bg-[#282828] p-1 rounded-full text-xs font-medium shadow-inner">
                      <button
                        type="button"
                        onClick={() => setUnit("in")}
                        className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                          unit === "in"
                            ? "bg-[#1C1C1E] text-white dark:!bg-white dark:!text-black shadow-sm"
                            : "text-gray-600 dark:!text-neutral-400 hover:text-black dark:hover:!text-white"
                        }`}
                      >
                        Inches
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit("cm")}
                        className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                          unit === "cm"
                            ? "bg-[#1C1C1E] text-white dark:!bg-white dark:!text-black shadow-sm"
                            : "text-gray-600 dark:!text-neutral-400 hover:text-black dark:hover:!text-white"
                        }`}
                      >
                        Centimeters
                      </button>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-black dark:!text-neutral-300 dark:hover:!text-white hover:bg-gray-100 dark:hover:!bg-neutral-800 transition-colors cursor-pointer"
                    aria-label="Close size guide"
                    type="button"
                  >
                    <IoClose size={24} />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-white dark:!bg-[#181818]">
              {isAdaa ? (
                <>
                  {/* Standard Size Table */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:!border-neutral-800 shadow-sm bg-white dark:!bg-[#1F1F1F]">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-[#F6F6F7] dark:!bg-[#282828]">
                          <th className="py-3 px-4 text-left text-xs font-bold text-gray-700 dark:!text-neutral-200 uppercase tracking-wider">
                            Size
                          </th>
                          {ADAA_SIZE_GUIDE.sizes.map((sz) => (
                            <th
                              key={sz}
                              className="py-3 px-3 text-center text-xs font-bold text-gray-800 dark:!text-neutral-200 uppercase tracking-wider"
                            >
                              {sz}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:!divide-neutral-800 bg-white dark:!bg-[#1F1F1F]">
                        {ADAA_SIZE_GUIDE.measurements.map((row) => (
                          <tr
                            key={row.label}
                            className="hover:bg-gray-50/70 dark:hover:!bg-neutral-800/60 transition-colors"
                          >
                            <td className="py-3.5 px-4 text-left font-semibold text-gray-900 dark:!text-white text-sm">
                              {row.label}
                            </td>
                            {ADAA_SIZE_GUIDE.sizes.map((sz) => (
                              <td
                                key={sz}
                                className="py-3.5 px-3 text-center text-sm text-gray-700 dark:!text-neutral-200 font-medium"
                              >
                                {formatValue(row.values[sz])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Fit & Fabric Details Table (Product Specific) */}
                  <div className="overflow-hidden rounded-xl border border-gray-200 dark:!border-neutral-800 shadow-sm bg-white dark:!bg-[#1F1F1F]">
                    <div className="px-4 pt-3.5 pb-2 bg-[#F6F6F7] dark:!bg-[#282828] border-b border-gray-200 dark:!border-neutral-800">
                      <h3 className="font-serif text-base sm:text-lg font-medium tracking-tight text-gray-900 dark:!text-white">
                        Fit &amp; Fabric Details
                      </h3>
                    </div>
                    <table className="w-full border-collapse">
                      <tbody className="divide-y divide-gray-100 dark:!divide-neutral-800 bg-white dark:!bg-[#1F1F1F]">
                        <tr className="hover:bg-gray-50/70 dark:hover:!bg-neutral-800/60 transition-colors">
                          <td className="py-3 px-4 text-left font-semibold text-gray-900 dark:!text-white text-sm w-1/3">
                            Fit
                          </td>
                          <td className="py-3 px-4 text-left text-sm text-gray-700 dark:!text-neutral-200">
                            {fitFabric.fit}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/70 dark:hover:!bg-neutral-800/60 transition-colors">
                          <td className="py-3 px-4 text-left font-semibold text-gray-900 dark:!text-white text-sm w-1/3">
                            Fabric
                          </td>
                          <td className="py-3 px-4 text-left text-sm text-gray-700 dark:!text-neutral-200">
                            {fitFabric.fabric}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/70 dark:hover:!bg-neutral-800/60 transition-colors">
                          <td className="py-3 px-4 text-left font-semibold text-gray-900 dark:!text-white text-sm w-1/3">
                            Stretch
                          </td>
                          <td className="py-3 px-4 text-left text-sm text-gray-700 dark:!text-neutral-200">
                            {fitFabric.stretch}
                          </td>
                        </tr>
                        <tr className="hover:bg-gray-50/70 dark:hover:!bg-neutral-800/60 transition-colors">
                          <td className="py-3 px-4 text-left font-semibold text-gray-900 dark:!text-white text-sm w-1/3">
                            Lining
                          </td>
                          <td className="py-3 px-4 text-left text-sm text-gray-700 dark:!text-neutral-200">
                            {fitFabric.lining}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* How to Measure Accordion */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setHowToMeasureOpen((prev) => !prev)}
                      className="w-full flex items-center justify-between py-2 text-left font-medium text-gray-900 dark:!text-white hover:opacity-80 transition-opacity cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-700 dark:!text-neutral-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                        <span className="text-sm font-semibold tracking-wide text-gray-900 dark:!text-white">
                          How to measure
                        </span>
                      </div>
                      {howToMeasureOpen ? (
                        <HiChevronUp className="w-5 h-5 text-gray-500 dark:!text-neutral-400" />
                      ) : (
                        <HiChevronDown className="w-5 h-5 text-gray-500 dark:!text-neutral-400" />
                      )}
                    </button>

                    {howToMeasureOpen && (
                      <div className="mt-3">
                        {/* Measurement Diagram Illustration from Screenshot 3 */}
                        {ADAA_SIZE_GUIDE.illustration && (
                          <div className="bg-[#F8F9FA] dark:!bg-[#222222] rounded-2xl p-4 flex flex-col items-center justify-center border border-gray-100 dark:!border-neutral-800">
                            <img
                              src={ADAA_SIZE_GUIDE.illustration}
                              alt="NARA How to measure body guide"
                              className="max-w-[280px] sm:max-w-[340px] w-full h-auto object-contain rounded-lg shadow-xs bg-white p-2"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Suggestions Box */}
                  <div className="p-4 sm:p-5 bg-[#F9F9FA] dark:!bg-[#222222] border border-gray-200 dark:!border-neutral-800 rounded-xl space-y-3.5">
                    <h3 className="font-serif text-base sm:text-lg font-medium tracking-tight text-gray-900 dark:!text-white">
                      Suggestions
                    </h3>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:!text-white">
                        1. Don’t know your measurements?
                      </h4>
                      <p className="text-xs text-gray-600 dark:!text-neutral-300 mt-1 leading-relaxed">
                        Start with your usual clothing size. For a roomier fit, consider sizing up, depending on the style.
                      </p>
                    </div>

                    <div className="border-t border-gray-200/70 dark:!border-neutral-700/60" />

                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:!text-white">
                        2. Need a little help?
                      </h4>
                      <p className="text-xs text-gray-600 dark:!text-neutral-300 mt-1 leading-relaxed">
                        Every silhouette fits differently! Reach out to us{" "}
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold underline underline-offset-2 text-[#1F4A40] dark:!text-teal-400 hover:opacity-80 transition-opacity"
                        >
                          HERE
                        </a>{" "}
                        with the piece you’re eyeing, and we’ll help you find your best fit.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* Legacy Fallback for other collections */
                <div className="space-y-4">
                  {showTops && (
                    <LegacyTable
                      title={isCoords ? "Tops" : ""}
                      data={legacyTopsData}
                      columns={legacyDefaultColumns}
                    />
                  )}
                  {showBottoms && (
                    <LegacyTable
                      title={isCoords ? "Bottoms" : ""}
                      data={legacyBottomsData}
                      columns={legacyDefaultColumns}
                    />
                  )}
                  {showMenTops && (
                    <LegacyTable
                      title="Men's Top"
                      data={legacyMenTopsData}
                      columns={legacyMenColumns}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
