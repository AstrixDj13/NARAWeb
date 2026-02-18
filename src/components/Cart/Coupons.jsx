import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

const Coupons = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full bg-white dark:bg-black dark:border dark:border-gray-800 shadow-md rounded-lg overflow-hidden">
            <button
                onClick={toggleOpen}
                className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-gray-900 dark:text-white">Coupons</span>
                </div>
                {isOpen ? (
                    <HiChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                ) : (
                    <HiChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
            </button>

            {isOpen && (

                <div className="flex flex-col gap-4">
                    <Link to="/products" className="flex items-center gap-4 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="w-32 h-32 flex-shrink-0">
                            <img
                                src="/icons/offer1.png"
                                alt="Special Offer"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-600">
                                Not applicable to products from new collection
                            </p>
                        </div>
                    </Link>
                </div>

            )}
        </div>
    );
};

export default Coupons;
