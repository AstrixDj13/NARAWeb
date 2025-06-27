import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const FooterSection = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div>
      <div className="bg-[#F5F5F5] dark:!bg-[#12322A] text-center pt-8 relative">
        <div
          className="top-2 text-[#1E7B74] text-sm cursor-pointer mt-16"
          onClick={scrollToTop}
        >
          <p>Scroll up</p>
          <div className="text-2xl">
            <i className="fas fa-chevron-up"></i>
          </div>
        </div>

        {/* Decorative Stars */}
        <div className="hidden 2xl:block text-[#C4C4C4] my-10">
          <div className="flex flex-wrap justify-center space-x-2 lg:space-x-5 mb-4">
            {Array(42)
              .fill(null)
              .map((_, index) => (
                <>
                  <img
                    title="image"
                    key={index}
                    src="/home/footer/star.svg"
                    alt="Decoration"
                    className="w-2 h-2 lg:w-4 lg:h-4"
                  />
                </>
              ))}
          </div>
          <div className="flex flex-wrap justify-center space-x-2 lg:space-x-5">
            {Array(42)
              .fill(null)
              .map((_, index) => (
                <>
                  <img
                    title="image"
                    key={index}
                    src="/home/footer/star.svg"
                    alt="Decoration"
                    className="w-2 h-2 lg:w-4 lg:h-4"
                  />
                </>
              ))}
          </div>
        </div>

        {/* Footer Links 
        <div className="text-[#1F4A40] dark:!text-[#D8E3B1] text-[8px] sm:text-[12px] lg:text-[14px] font-bold my-4 md:mb-4 px-10 sm:px-16">
          <div className="grid grid-cols-3 lg:flex lg:flex-row justify-center gap-y-2 lg:space-x-8 xl:space-x-20">
            <a href="#" className="underline">
              Contact us
            </a>
            <a href="#" className="underline">
              Track order
            </a>
            <a href="#" className="underline">
              Privacy policies
            </a>
            <a href="#" className="underline">
              Privacy policies
            </a>
            <a href="#" className="underline">
              Terms of use
            </a>
            <a href="#" className="underline">
              Shipping policies
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-black text-[8px] sm:text-[10px] font-bold text-white py-2 sm:py-4 tracking-widest">
          <p>Copyright © 2024 NARA. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default FooterSection;
