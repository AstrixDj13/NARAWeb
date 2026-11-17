import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SizeChart from "./SizeChart";

export default function SizeSelector({ sizes, defaultSize, selectSize, productId, product }) {
  const sizeConfirmed = useSelector((state) => state.activeProduct.sizeConfirmed);
  const sizePromptAt = useSelector((state) => state.activeProduct.sizePromptAt);
  const [showPrompt, setShowPrompt] = useState(false);

  // Highlight the selector when the shopper taps Add to Bag / Buy Now without choosing a size
  useEffect(() => {
    if (sizeConfirmed) {
      setShowPrompt(false);
      return;
    }
    if (!sizePromptAt) return;
    setShowPrompt(true);
    const t = setTimeout(() => setShowPrompt(false), 2500);
    return () => clearTimeout(t);
  }, [sizePromptAt, sizeConfirmed]);

  return (
    <div
      id="size-selector"
      className={`flex flex-col gap-3 tracking-tighter w-full scroll-mt-40 rounded-lg transition-all ${showPrompt ? "ring-2 ring-red-500 ring-offset-4 ring-offset-[#F7F7F7] dark:ring-offset-black" : ""}`}
    >
      <div className="flex justify-between items-center w-full">
        <h2 className="font-bold text-lg tracking-tighter">
          {defaultSize ? <>Size: <span className="font-normal">{defaultSize}</span></> : "Select Size"}
        </h2>
        {/* Size Chart Component */}
        <SizeChart productId={productId} product={product} />
      </div>

      {!sizeConfirmed && showPrompt && (
        <p className="text-sm font-semibold text-red-600 -mt-1">Please select a size</p>
      )}

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <SizeItem
            key={size.name}
            enabled={size.enabled}
            name={size.name}
            selectSize={selectSize}
            defaultSizeName={defaultSize}
          />
        ))}
      </div>

      <Link to="/fit-quiz" className="text-xs underline text-gray-600 dark:text-gray-400 w-fit -mt-1">
        Not sure of your size? Take the 30-second size quiz
      </Link>

      <div className="hidden">
        {/* {sizes.disabledSizes?.map((size, index) => (
            <button
              key={index}
              className={`border-2 w-8 h-8 border-[#BEBCBD] disabled:text-gray-300 `}
              disabled={true}
            >
              {size}
            </button>
          ))} */}
      </div>
    </div>
  );
}

function SizeItem({ name, defaultSizeName, selectSize, enabled }) {
  const clickHandler = () => {
    selectSize("Size", name);
  };

  return (
    <button
      title={enabled ? name : "Not available with other selected options!"}
      onClick={clickHandler}
      className={`border-2 min-w-[44px] h-11 px-2 text-sm font-semibold border-[#BEBCBD] disabled:opacity-25 disabled:line-through transition-colors ${
        name === defaultSizeName ? "bg-[#1F4A40] border-[#1F4A40] text-white" : "hover:border-[#1F4A40]"
      }`}
      disabled={!enabled}
    >
      {name}
    </button>
  );
}
