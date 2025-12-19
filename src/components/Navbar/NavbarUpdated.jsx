import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SliderNavbar from "./SliderNavbar";
import CartIcon from "../CartIcon";
import { useDispatch } from "react-redux";
import { setAppTheme } from "../../store";
import { getCollections } from "../../apis/Collections"; // No longer needed if "Browse Collections" is removed

import AuthModal from "../Auth/AuthModal";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  // const [collections, setCollections] = useState([]); // Not needed if "Browse Collections" is removed
  const [isOpen, setIsOpen] = useState(false); // State for mobile slider menu (controlled by hamburger)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement;

  // State to manage hover for the "CLOTHING" menu
  const [isClothingHovered, setIsClothingHovered] = useState(false);

  const [allCollections, setAllCollections] = useState([]);

  const fetchCollections = async () => {
    try {
      const allCollections = await getCollections();
      console.log(allCollections);
      setAllCollections(allCollections.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Fetch collections from API - REMOVED if "Browse Collections" is gone
  /*
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const all = await getCollections();
        setCollections(all.reverse());
      } catch (error) {
        console.error("Failed to load collections:", error);
      }
    };
    fetchCollections();
  }, []);
  */

  // Theme handling
  useEffect(() => {
    if (theme === "dark") element.classList.add("dark");
    else element.classList.remove("dark");
    dispatch(setAppTheme(theme));
  }, [theme, dispatch]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector(".carousel-inner"); // Assuming this is your hero section
      const offset = hero ? hero.offsetHeight - 100 : 50;
      setIsScrolled(window.pageYOffset > offset);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen((prev) => !prev);

  {/*const bgClass = isScrolled
    ? theme === "light"
      ? "bg-white text-black"
      : "bg-black text-white"
    : theme === "light"
    ? "bg-transparent text-black"
    : "bg-transparent text-white";*/}

  const bgClass = isScrolled
    ? theme === "light"
      ? "bg-white text-black"
      : "bg-black text-white"
    : theme === "light"
      ? "bg-white text-black"
      : "bg-black text-white";

  return (
    <div className="relative">
      <nav
        className={
          !isScrolled
            ? `top-[6.9rem] fixed left-0 w-full z-[100] flex justify-between items-center md:px-10 pl-4 pr-2 py-4 sm:py-2 transition-colors duration-300 ${bgClass}`
            : `fixed top-[6.4rem] left-0 w-full z-[100] flex justify-between items-center md:px-10 pl-4 pr-2 py-4 sm:py-2 transition-colors duration-300 ${bgClass}`
        }
      >
        {/* Left Section: Hamburger and Logo */}
        <div className="flex items-center space-x-4">
          {/*<button onClick={toggleMenu} className="text-4xl font-bold text-white">
            &#9776; */} {/* Hamburger always visible */}
          {/*</button>*/}

          <button
            onClick={toggleMenu}
            className={`text-3xl font-bold ${isScrolled
              ? theme === "light"
                ? "text-black"
                : "text-white"
              : theme === "light"
                ? "text-black"
                : "text-white"
              }`}
          >
            &#9776;
          </button>
          <Link to="/" className="flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-[500px]">
            <img
              src={
                isScrolled
                  ? theme === "dark"
                    ? "/logo2.svg"
                    : "/logo.svg"
                  : theme === "dark"
                    ? "/logo2.svg"
                    : "/logo.svg"
              }
              alt="logo"
              className={
                isScrolled
                  ? "h-[70px] -mt-4"
                  : "xl:h-[130px] lg:h-[140px] md:h-[100px] h-[80px] sm:absolute md:-top-3 lg:-top-8"

              }
            />
          </Link>
        </div>


        {/* Right Section: Navigation (Clothing) and Icons */}
        <div className="flex gap-6 items-center">



          {/* Right-side Icons */}
          <div className="flex items-center md:space-x-5 space-x-2">
            <button onClick={toggleTheme} className="text-4xl rounded-full">
              <img
                src="/home/navbar/light_icon1.svg"
                alt={`${theme} mode icon`}

                className={
                  theme === "light" && !isScrolled
                    ? "black-icon"
                    : theme === "dark" && !isScrolled
                      ? "white-icon"
                      : theme === "light" && isScrolled
                        ? "black-icon"
                        : theme === "dark" && isScrolled
                          ? "white-icon" : ""
                }
              />
            </button>

            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/profile");
                } else {
                  setIsAuthModalOpen(true);
                }
              }}
            >
              <img
                src="home/navbar/user.svg"
                alt="user icon"

                className={
                  theme === "light" && !isScrolled
                    ? "black-icon"
                    : theme === "dark" && !isScrolled
                      ? "white-icon"
                      : theme === "light" && isScrolled
                        ? "black-icon"
                        : theme === "dark" && isScrolled
                          ? "white-icon" : ""
                }
              />
            </button>

            {/*<CartIcon theme={theme} OnHomePageHeroSection={!isScrolled} />*/}
            <CartIcon theme={theme} />
          </div>
        </div>
      </nav>

      {/* SliderNavbar (Mobile Menu) - This remains untouched and should work as before */}
      <SliderNavbar isOpen={isOpen} toggleMenu={toggleMenu} allCollections={allCollections} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default Navbar;