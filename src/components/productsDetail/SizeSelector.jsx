import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
export default function SizeSelector({ sizes, defaultSize, selectSize }) {
  const [sizeGuideVisible, setSizeGuideVisible] = useState(false);

  const toggleSizeGuideVisibility = () => {
    setSizeGuideVisible((state) => !state);
  };

  return (
    <div className="flex flex-col gap-4 tracking-tighter">
      {/* Size Guide */}
      {sizeGuideVisible && (
        <div
          onClick={toggleSizeGuideVisibility}
          className="bg-black/50 fixed  top-0 right-0 bottom-0 left-0 z-[9900000] flex  bg-[rgb()] items-center justify-center"
        >
          <img
            title="image"
            onClick={(e) => e.stopPropagation()}
            className="xl:h-full h-5/6"
            src="/productDetail/sizeGuide.jpeg"
            alt=""
          />
        </div>
      )}
      <h2 className="font-bold text-lg">
        Select Size |{" "}
        <button className="underline" onClick={toggleSizeGuideVisibility}>
          {" "}
          Size Guide
        </button>{" "}
        <HiOutlineArrowRight className="inline" />
      </h2>

      <div className="flex gap-4">
        {sizes.map((size) => (
          <SizeItem
            key={size.name}
            enabled={size.enabled}
            name={size.name}
            selectSize={selectSize}
            defaultSizeName={defaultSize}
          />
        ))}

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
      className={`border-2 w-8 h-8 border-[#BEBCBD] disabled:opacity-25   ${
        name === defaultSizeName ? "bg-[#1F4A40] text-white" : ""
      }`}
      disabled={!enabled}
    >
      {name}
    </button>
  );
}
