export default function SizeSelector({ sizes, defaultSize, selectSize }) {

  return (
    <div className="flex flex-col gap-4 tracking-tighter">
      <h2 className="font-bold text-lg">
        Select Size
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

      {/* Size Chart Image */}
      <div className="mt-4">
        <img
          title="Size Chart"
          src="/size_chart.jpg"
          alt="Size Chart"
          className="w-full max-w-2xl"
        />
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
      className={`border-2 w-8 h-8 border-[#BEBCBD] disabled:opacity-25   ${name === defaultSizeName ? "bg-[#1F4A40] text-white" : ""
        }`}
      disabled={!enabled}
    >
      {name}
    </button>
  );
}
