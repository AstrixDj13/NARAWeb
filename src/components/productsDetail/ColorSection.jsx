import { HiOutlineArrowRight } from "react-icons/hi";
import { useState, useEffect } from "react";

export default function ColorSection({
  colors,
  defaultColor,
  availableChoices,
  selectColor
}) {
  const [availableColors, setAvailableColors] = useState([]);

  useEffect(() => {
    const allColorsWithValues = colors;
    const availableColorChoices = availableChoices;
    const updatedColorChoices = availableColorChoices.map(colorObject=>{
      const value = allColorsWithValues.find(colorElement=>colorElement.name==colorObject.name).value;
      return {name: colorObject.name, value, enabled: colorObject.enabled}
    });

    setAvailableColors(updatedColorChoices);

   
  }, [availableChoices, colors]);

  return (
    <div className="flex flex-col gap-4 tracking-tighter">
      <h2 className="font-bold text-lg">
        Select Color | <span className="underline"> Color Guide</span>{" "}
        <HiOutlineArrowRight className="inline" />
      </h2>

      <div className="relative flex gap-2 flex-wrap">
        {availableColors.map((el, index) => (
          <SingleColorItem
            key={el.name}
            name={el.name}
            value={el.value}
            image={el.image}
            defaultColor={defaultColor}
            selectColor = {selectColor}
            enabled = {el.enabled}
          />
        ))}
      </div>
    </div>
  );
}

function SingleColorItem({ name, value, image, defaultColor, selectColor, enabled }) {
  const clickHandler = () => {
    
    if(enabled)
    selectColor("Color", name);
    
  };

  return (
    <div
      className={`w-12 h-12 relative p-1 rounded-full  ${
        defaultColor === name
          ? "border-3 border-indigo-500 shadow-lg " 
          : "" 
      }`}
      style={{ backgroundColor: "white" }}
    >


      <button
        disabled={!enabled}
        title={enabled ? name : "Not available with other selected options!"}
        className={`relative w-full h-full rounded-full disabled:opacity-25 `}
        style={{
          backgroundColor: value || "white",
          backgroundImage: image ? `url(${image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          
        }}
        onClick={clickHandler}
      >
        {!enabled && <div className="bg-red-500 p-[1px] shadow--lg rotate-45   ">
          
          </div>}
      </button>
    </div>
  );
}
