import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SliderNavbar = ({ isOpen, toggleMenu }) => {
  const [activeLink, setActiveLink] = useState("home");
  const location = useLocation();
  React.useEffect(() => {
    if (location.pathname === "/") {
      setActiveLink("home");
    } else if (location.pathname === "/about") {
      setActiveLink("about");
    } else if (location.pathname === "/products") {
      setActiveLink("products");
    }
  }, [location.pathname]);
  const handleClick = (Link) => {
    setActiveLink(Link);
  };
  return (
    <div>
      <div
        className={`fixed top-0 overflow-scroll left-0 h-full w-full transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 bg-[#f5f5e1] dark:!bg-black pt-8 px-8 md:p-12">
            <div className="flex justify-end items-center">
              {/* <button className="text-black dark:!text-white font-bold text-lg md:text-xl pl-0">
                Menu
              </button> */}
              <button
                className="text-black dark:!text-white font-bold text-lg md:text-xl px-3 py-3 border border-[#B5B5B5]"
                onClick={toggleMenu}
              >
                ✕
              </button>
            </div>
            <div className="mt-10 md:mt-14">
              <ul className="space-y-8 md:space-y-14">
                <li>
                  <Link
                    to="/"
                    onClick={() => handleClick("home")}
                    className="text-lg md:text-xl text-[#5D5D5D] italic"
                  >
                    01{" "}
                    <span
                      className={`${
                        activeLink === "home"
                          ? "text-green-800"
                          : "text-black dark:!text-[#D8E3B1]"
                      }  text-3xl md:text-5xl font-semibold not-italic pl-2 md:pl-7 md:tracking-widest `}
                    >
                      HOME
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/products"}
                    onClick={() => handleClick("products")}
                    className="text-lg md:text-xl  text-[#5D5D5D] italic"
                  >
                    02
                    <span
                      className={`${
                        activeLink === "products"
                          ? "text-green-800"
                          : "text-black dark:!text-[#D8E3B1]"
                      } text-3xl md:text-5xl font-semibold   not-italic pl-4 md:pl-8 md:tracking-widest`}
                    >
                      OUR SHOP
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    onClick={() => handleClick("about")}
                    className="text-lg md:text-xl  text-[#5D5D5D] italic"
                  >
                    03
                    <span
                      className={`text-3xl md:text-5xl font-semibold not-italic pl-4 md:pl-8 md:tracking-widest ${
                        activeLink === "about"
                          ? "text-green-800"
                          : "text-black dark:!text-[#D8E3B1]"
                      }`}
                    >
                      ABOUT US
                    </span>
                  </Link>
                </li>
                <li className="flex">
                  <div className="text-lg md:text-xl  text-[#5D5D5D] italic">
                    04
                  </div>
                  <Link
                    to="/behind"
                    className="text-lg md:text-xl  text-[#5D5D5D] italic"
                  >
                    <span className="text-3xl md:text-5xl font-semibold text-black dark:!text-[#D8E3B1] not-italic pl-4 md:pl-8 md:tracking-widest">
                      BEHIND THE SCREEN
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:fixed bottom-0 left-0 w-full text-black pb-6 pt-10 md:p-10 md:pl-12">
              <div className="flex md:space-x-3 space-x-1">
                {/* <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img title="image" src="/home/navbar/fb.svg" alt="facebook" />
                </a> */}
                <a
                  href="https://www.instagram.com/narawearr?igsh=MWgzcXhzNm4xb2Nnbw=="
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    title="image"
                    src="/home/navbar/insta.svg"
                    alt="instagram"
                  />
                </a>
                <div className="flex items-center space-x-1  md:space-x-2  bg-white px-2 rounded-xl ">
                  <a
                    href="mailto:info@narawear.com"
                    className="text-black text-xs md:text-[16px] font-sans font-medium"
                  >
                    info@narawear.com
                  </a>
                  <img
                    title="image"
                    src="/home/navbar/file.svg"
                    alt="Product"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-10 md:p-8 flex justify-center items-center bg-white dark:!bg-black relative">
            <div className="text-center ">
              <h1
                className="text-4xl md:text-6xl font-extrabold text-[#1F4A403B] dark:!text-[#D8E3B1] tracking-[0.60em] md:tracking-[0.40em]"
                style={{ lineHeight: "1.2" }}
              >
                NEW AGE
              </h1>
              <div className="mt-2 relative object-cover">
                <img
                  title="image"
                  src="/home/navbar/slideimg.jpg"
                  alt="Product"
                  className="w-full max-h-[450px] object-cover"
                />
                <h2
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl md:text-7xl font-semibold text-white bg-opacity-50 px-4 py-2"
                  style={{ letterSpacing: "20px" }}
                >
                  REAL
                </h2>
              </div>
              <h1 className="text-4xl md:text-6xl pl-4 md:pl-6 font-extrabold text-[#1F4A403B] dark:!text-[#D8E3B1] mt-2 tracking-[0.74em] md:tracking-[0.60em]">
                ATTIRE
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderNavbar;
