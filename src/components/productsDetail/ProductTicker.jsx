import React from "react";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { FaTruck } from "react-icons/fa";
import { GiLion } from "react-icons/gi";

const ProductTicker = () => {
    return (
        <div className="mt-[90px] lg:mt-[105px] w-full border-b border-gray-200 dark:!border-gray-800 py-3 bg-white dark:!bg-black flex justify-evenly items-center text-xs md:text-sm font-semibold text-gray-800 dark:!text-white px-4 overflow-x-auto whitespace-nowrap gap-6 scrollbar-hide shrink-0 z-40 relative">

            <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="text-xl md:text-2xl text-black dark:!text-white" />
                <span>100% Secure Transaction</span>
            </div>

            <div className="flex items-center gap-2">
                <FaTruck className="text-xl md:text-2xl text-black dark:!text-white" />
                <span>Free Shipping</span>
            </div>

            <div className="flex items-center gap-2">
                <GiLion className="text-[1.3rem] md:text-2xl text-black dark:!text-white" />
                <span>100% Made In India</span>
            </div>

        </div>
    );
};

export default ProductTicker;