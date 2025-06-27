import { useState, useEffect, useRef } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { toast } from "sonner";
import ColorSection from "./ColorSection";
import SizeSelector from "./SizeSelector";
import { useDispatch } from "react-redux";
import { setCurrentVariant, setOutOfStock } from "../../store";

export default function VariantsController({ options, variants, colorsArray, scrollToImageBySrc }) {
  const [optionsList, setOptionsList] = useState([]);
  const [variantsInStock, setVariantsInStock] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [optionsChoiceList, setOptionsChoiceList] = useState({});
  const [defaultColor, setDefaultColor] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    
    let choicesList = {};
    let optionsList = [];
    options?.forEach(option => {
      choicesList[option.name] = option.values.map(el => ({ name: el, enabled: true }));
      optionsList.push(option.name);
    });

    

    setOptionsChoiceList(choicesList);
    setOptionsList(optionsList);

    const inStockVariants = variants?.edges?.filter(
      (variant) => parseInt(variant.node.quantityAvailable) > 0
    );

    setVariantsInStock(inStockVariants);

    // Select lowest priced variant as default
    if (inStockVariants?.length > 0) {
      dispatch(setOutOfStock(false));
      // const lowestVariant = inStockVariants.reduce((prev, cur) =>
      //   +cur.node.price.amount < +prev.node.price.amount ? cur : prev
      // );

      const firstVariant = inStockVariants[0]

      dispatch(setCurrentVariant(firstVariant));

      const defaultSelectedOptions = {};
      firstVariant.node?.selectedOptions?.forEach((option) => {
        defaultSelectedOptions[option.name] = option.value;
      });

      scrollToImageBySrc(firstVariant.node?.image?.src);

      setSelectedOptions(defaultSelectedOptions);
      

      const varinstocks = variants?.edges?.filter(
        (variant) => parseInt(variant.node.quantityAvailable) > 0
      );
      updateOptionStatuses(choicesList, defaultSelectedOptions, varinstocks);
    } else {
      dispatch(setOutOfStock(true));

      // disable all options choices
      setOptionsChoiceList(() => {
        // get all the keys in the choicesList
        const options = Object.keys(choicesList);

        options.forEach(option => {
          return (choicesList[option] = choicesList[option].map(el => ({ name: el.name, enabled: false })));
        });

        return choicesList;
      });
    }
  }, [options, variants]);

  const handleOptionChange = (name, value) => {
    let updatedSelectedOptions = { ...selectedOptions };

    for (const key in selectedOptions) {
      if (name === key) {
        updatedSelectedOptions[name] = value;
      }
    }

    const hasNullProperty = Object.values(updatedSelectedOptions).some((value) => value === null);

    if (!hasNullProperty) {
      const matchedNode = variantsInStock?.find((item) => {
        const selectedOptions = item.node.selectedOptions;
        
        return selectedOptions?.every(
          (option) => updatedSelectedOptions[option.name] === option.value
        );
      });

      

      if (!matchedNode) {
        toast.info("This combination is not available");
        updatedSelectedOptions = { ...selectedOptions };
      } else {
        
        scrollToImageBySrc(matchedNode.node?.image?.src);
        dispatch(setCurrentVariant(matchedNode));
      }
    }

    setSelectedOptions(updatedSelectedOptions);
    updateOptionStatuses(optionsChoiceList, updatedSelectedOptions, variantsInStock);
  };

  const findVariant = (newSelectedOptions, varinstocks) => {
    return varinstocks?.find((item) => {
      const selectedOptions = item.node.selectedOptions;
      return selectedOptions?.every((option) => newSelectedOptions[option.name] === option.value);
    });
  };

  const updateOptionStatuses = (optionChoices, selectedOptions, varinstocks) => {
    Object.keys(optionChoices).forEach(optionKey => {
      const currentOption = optionKey;
      const optionValues = optionChoices[currentOption]?.map(el => el.name);

      optionValues?.forEach(value => {
        const newSelection = { ...selectedOptions, [currentOption]: value };
        const variantExists = findVariant(newSelection, varinstocks);
        optionChoices[currentOption] = optionChoices[currentOption]?.map(opt =>
          opt.name === value ? { ...opt, enabled: !!variantExists } : opt
        );
      });
    });

    setOptionsChoiceList(optionChoices);
  };

  return (
    <>
      {optionsList?.map((option) =>
        option === "Color" ? (
          <ColorSection
            key={option}
            availableChoices={optionsChoiceList[option] || []}
            defaultColor={selectedOptions[option]}
            colors={colorsArray}
            selectColor={handleOptionChange}
          />
        ) : option === "Size" ? (
          <SizeSelector
            key={option}
            selectSize={handleOptionChange}
            defaultSize={selectedOptions[option]}
            sizes={optionsChoiceList[option] || []}
          />
        ) : (
          <VariantFilter
            key={option}
            name={option}
            list={optionsChoiceList[option] || []}
            selectedOption={selectedOptions[option]}
            onOptionChange={handleOptionChange}
          />
        )
      )}
    </>
  );
}

function VariantFilter({ name, list, selectedOption, onOptionChange, enabled }) {
  const optionListRef = useRef(null);

  return (
    <div className="w-full flex flex-col gap-2">
      <h3 className="font-bold">Select {name}</h3>
      <select
        onChange={(e) => onOptionChange(name, e.target.value)}
        name={name}
        ref={optionListRef}
        value={selectedOption || ""}
        className="w-full p-2 bg-transparent border-1 border-dashed border-black px-2 dark:border-white dark:text-white dark:bg-black"
      >
        <option value="" disabled>
          Select {name}
        </option>
        {list?.map((value) => (
          <option
            title={!enabled && "Not available with other selected options!"}
            className="dark:bg-black disabled:bg-gray-100 disabled:text-gray-200"
            disabled={!value.enabled}
            key={value.name}
            value={value.name}
          >
            {value.name}
          </option>
        ))}
      </select>
    </div>
  );
}
