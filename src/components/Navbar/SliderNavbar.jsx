import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCollections } from "../../apis/Collections";

const SliderNavbar = ({ isOpen, toggleMenu, allCollections: initialCollections }) => {
  const [activeLink, setActiveLink] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024); // Tailwind's lg breakpoint
  const [showDropdown, setShowDropdown] = useState(false);

  const [collections, setCollections] = useState(initialCollections || []);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!initialCollections || initialCollections.length === 0) {
      // Fetch only if not already provided
      getCollections()
        .then((data) => setCollections(data.reverse()))
        .catch((err) => console.error("Failed to fetch collections:", err));
    } else {
      setCollections(initialCollections); // in case prop changes
    }
  }, [initialCollections]);

  const location = useLocation();
  {/*React.useEffect(() => {
    if (location.pathname === "/") {
      setActiveLink("home");
    } else if (location.pathname === "/about") {
      setActiveLink("about");
    } else if (location.pathname === "/products") {
      setActiveLink("products");
    }
  }, [location.pathname]);*/}

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const collectionId = params.get("id");

    if (location.pathname === "/") {
      setActiveLink("home");
    } else if (location.pathname === "/about") {
      setActiveLink("about");
    } else if (location.pathname === "/products") {
      setActiveLink("products");
    } else if (location.pathname === "/collection" && collectionId) {
      const bestsellersCollection = collections.find(item => item.title === "Bestsellers");
      const newArrivalsCollection = collections.find(item => item.title === "Chaon: The Summer Edit 2025");

      if (bestsellersCollection && collectionId === encodeURIComponent(bestsellersCollection.id)) {
        setActiveLink("most-wanted");
      } else if (newArrivalsCollection && collectionId === encodeURIComponent(newArrivalsCollection.id)) {
        setActiveLink("new-arrivals");
      } else {
        // Handle other collections in the dropdown, if needed.
        setActiveLink("");
      }
    } else {
      setActiveLink("");
    }
  }, [location.pathname, location.search, collections]); // Add 'collections' to dependencies

  const handleClick = (Link) => {
    setActiveLink(Link);
    toggleMenu();
  };
  return (
    <div>
      <div
        className={`fixed top-0 overflow-scroll left-0 h-full w-full transition-transform duration-300 z-[101] ${isOpen ? "translate-x-0" : "-translate-x-full"
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
            <div className="mt-10 md:mt-1">
              <ul className="space-y-8 md:space-y-4">
                <li>
                  <Link
                    to="/"
                    onClick={() => handleClick("home")}
                    className="text-lg md:text-2xl text-[#5D5D5D] italic"
                  >
                    {/*01{" "}*/}
                    <span
                      className={`${activeLink === "home"
                        ? "text-green-800"
                        : "text-black dark:!text-[#D8E3B1]"
                        }  text-xl md:text-2xl font-semibold not-italic pl-4 md:pl-8 md:tracking-widest `}
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
                    {/*02*/}
                    <span
                      className={`${activeLink === "products"
                        ? "text-green-800"
                        : "text-black dark:!text-[#D8E3B1]"
                        } text-xl md:text-2xl font-semibold   not-italic pl-4 md:pl-8 md:tracking-widest`}
                    >
                      ALL PRODUCTS
                    </span>
                  </Link>
                </li>

                <li>
                  {/*<div className="text-lg md:text-xl text-[#5D5D5D] italic">02</div>*/}
                  <div
                    className="pl-4 md:pl-8 cursor-pointer"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <h3 className="text-xl md:text-2xl font-semibold text-black dark:!text-[#D8E3B1] not-italic tracking-widest">
                      CATEGORIES {showDropdown ? "▲" : "▼"}
                    </h3>
                  </div>
                  {showDropdown && (
                    <ul className="mt-2 space-y-2 pl-4 md:pl-8">
                      {/* Static "All" item */}
                      {collections
                        ?.filter(item =>
                          ["Tops", "Bottoms", "Co-ord sets"].includes(item.title)
                        )
                        .map((item, index) => (
                          <li key={index}>
                            <Link
                              to={`/collection?id=${encodeURIComponent(item.id)}`}
                              onClick={() => handleClick(item.title)}
                              className="block text-[16px] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>

                {collections
                  ?.filter(item => item.title === "Rs. 300 OFF on orders above Rs. 1499!") // Only pick Bestsellers
                  .map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          to={`/collection?id=${encodeURIComponent(item.id)}`}
                          onClick={() => handleClick("most-wanted")}
                          className="text-lg md:text-xl text-[#5D5D5D] italic"
                        >
                          <span
                            className={`${activeLink === "most-wanted"
                              ? "text-green-800"
                              : "text-black dark:!text-[#D8E3B1]"
                              } text-xl md:text-2xl font-semibold not-italic pl-4 md:pl-8 md:tracking-widest`}
                          >
                            ON Going OFFERS
                          </span>
                        </Link>
                      </li>
                    );
                  })}

                {collections
                  ?.filter(item => item.title === "Bestsellers") // Only pick Bestsellers
                  .map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          to={`/collection?id=${encodeURIComponent(item.id)}`}
                          onClick={() => handleClick("most-wanted")}
                          className="text-lg md:text-xl text-[#5D5D5D] italic"
                        >
                          <span
                            className={`${activeLink === "most-wanted"
                              ? "text-green-800"
                              : "text-black dark:!text-[#D8E3B1]"
                              } text-xl md:text-2xl font-semibold not-italic pl-4 md:pl-8 md:tracking-widest`}
                          >
                            MOST WANTED
                          </span>
                        </Link>
                      </li>
                    );
                  })}

                {collections
                  ?.filter(item => item.title === "LAYA - The Work Edit") // Only pick Bestsellers
                  .map((item, index) => {
                    return (
                      <li key={index}>
                        <Link
                          to={`/collection?id=${encodeURIComponent(item.id)}`}
                          onClick={() => handleClick("new-arrivals")}
                          className="text-lg md:text-xl text-[#5D5D5D] italic"
                        >
                          <span
                            className={`${activeLink === "new-arrivals"
                              ? "text-green-800"
                              : "text-black dark:!text-[#D8E3B1]"
                              } text-xl md:text-2xl font-semibold not-italic pl-4 md:pl-8 md:tracking-widest`}
                          >
                            NEW ARRIVALS
                          </span>
                        </Link>
                      </li>
                    );
                  })}

                <li>
                  <Link
                    to="/about"
                    onClick={() => handleClick("about")}
                    className="text-lg md:text-xl  text-[#5D5D5D] italic"
                  >
                    {/*03*/}
                    <span
                      className={`text-xl md:text-2xl font-semibold not-italic pl-4 md:pl-8 md:tracking-widest ${activeLink === "about"
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
                    {/*04*/}
                  </div>
                  <Link
                    to="/behind"
                    className="text-lg md:text-xl  text-[#5D5D5D] italic"
                  >
                    <span className="text-xl md:text-2xl font-semibold text-black dark:!text-[#D8E3B1] not-italic pl-4 md:pl-8 md:tracking-widest">
                      BEHIND THE SCREEN
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:relative bottom-0 left-0 w-full text-black pb-6 pt-10 md:p-10 md:pl-12">
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
                <a
                  href="https://wa.me/919930835594"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    title="WhatsApp"
                    src="/home/navbar/WhatsApp.svg.webp"
                    alt="whatsapp"
                    className="w-6 h-6"
                  />
                </a>
                {/*<div className="flex items-center space-x-1  md:space-x-2  bg-white px-2 rounded-xl ">
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
                </div>*/}

                <div
                  className="
                    flex flex-wrap items-center 
                    gap-1 md:gap-2 
                    bg-white px-2 py-1 rounded-xl 
                    max-w-[220px] md:max-w-[260px] 
                    overflow-hidden
                  "
                >
                  <a
                    href="mailto:info@narawear.com"
                    className="text-black text-xs md:text-sm lg:text-base font-sans font-medium truncate"
                    title="info@narawear.com"
                  >
                    info@narawear.com
                  </a>
                  <img
                    title="Email icon"
                    src="/home/navbar/file.svg"
                    alt="Product"
                    className="w-4 h-4 md:w-5 md:h-5"
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
