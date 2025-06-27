import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoAdd } from "react-icons/io5";

const CategoryPill = ({ name }) => {
    const [active, setActive] = useState(false)
    const handleCategoryState = () => {
        setActive(!active)
    }
  return (
    <div className={`flex-shrink-0 flex gap-1 items-center px-3 font-medium border-2 rounded-full py-1 border-gray-500 cursor-pointer text-sm ${active && "bg-[#D8E3B1] text-[#08332C]"}`} onClick={handleCategoryState}>
        {name}
        {active ? (
            <IoMdClose className="text-xl"/>
        ) : (
            <IoAdd className="text-xl"/>
        )}
    </div>
  )
}

export default CategoryPill