import React, { useRef, useEffect } from "react";
import { HiOutlineShieldCheck, HiOutlineMail } from "react-icons/hi";
import { FaTruck } from "react-icons/fa";
import { GiLion } from "react-icons/gi";

const ProductTicker = ({ isHomePage = false, hasMarquee = false }) => {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (scrollContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

                // Check if we reached the right edge
                // Using Math.ceil and -1 for rounding safety
                if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 1) {
                    scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
                } else {
                    scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const layoutClasses = isHomePage
        ? `fixed ${hasMarquee ? 'top-[26px] md:top-7' : 'top-0'} z-[90] bg-[#0e2a1a] text-white`
        : `mt-[121px] md:mt-[91px] xl:mt-[107px] sticky top-[121px] md:top-[91px] xl:top-[107px] z-40 bg-white dark:!bg-black border-b border-gray-200 dark:!border-gray-800 text-gray-800 dark:!text-white`;

    const iconColor = isHomePage ? "text-white" : "text-black dark:!text-white";

    return (
        <div
            ref={scrollContainerRef}
            className={`${layoutClasses} w-full py-3 flex justify-start md:justify-evenly items-center text-xs md:text-sm font-semibold px-4 overflow-x-auto whitespace-nowrap gap-6 scrollbar-hide shrink-0 snap-x snap-mandatory`}
            style={{ scrollBehavior: 'smooth' }}
        >

            <div className="flex items-center gap-2 snap-center shrink-0">
                <HiOutlineShieldCheck className={`text-xl md:text-2xl ${iconColor}`} />
                <span>100% Secure Transaction</span>
            </div>

            <div className="flex items-center gap-2 snap-center shrink-0">
                <FaTruck className={`text-xl md:text-2xl ${iconColor}`} />
                <span>Free Shipping</span>
            </div>

            <div className="flex items-center gap-2 snap-center shrink-0">
                <GiLion className={`text-[1.3rem] md:text-2xl ${iconColor}`} />
                <span>100% Made In India</span>
            </div>

            {isHomePage && (
                <div className="flex items-center gap-2 snap-center shrink-0">
                    <HiOutlineMail className={`text-xl md:text-2xl ${iconColor}`} />
                    <span>5% off on Newsletter Signup</span>
                </div>
            )}

        </div>
    );
};

export default ProductTicker;