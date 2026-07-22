import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import SliderNavbar from "./SliderNavbar";
import CartIcon from "../CartIcon";
import { useDispatch } from "react-redux";
import { setAppTheme } from "../../store";
import { getCollections } from "../../apis/Collections";
import { getActiveCampaigns } from "../../utils/campaignUtils";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { useWishlist } from "../../context/WishlistContext";

const AuthModal = lazy(() => import("../Auth/AuthModal"));
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State for mobile slider menu (controlled by hamburger)
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement;
  const { wishlist } = useWishlist();

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

  const isHomePage = location.pathname === "/";

  const [topNavClass, setTopNavClass] = useState("top-0");

  useEffect(() => {
    const activeCampaigns = getActiveCampaigns();
    const hasMarquee = activeCampaigns.some(c => c.marqueeMessage);
    const hasCountdown = activeCampaigns.some(c => c.name || c.targetDate);

    if (isHomePage) {
      // Adding ~3rem (48px) to account for the fixed ProductTicker
      if (hasMarquee && hasCountdown) {
        setTopNavClass("top-[8.5rem]");
      } else if (hasMarquee) {
        setTopNavClass("top-[4.5rem]"); // Marquee (~24px) + Ticker (~48px)
      } else if (hasCountdown) {
        setTopNavClass("top-[7rem]");
      } else {
        setTopNavClass("top-[3rem]"); // Just Ticker
      }
    } else {
      setTopNavClass("top-0");
    }
  }, [isHomePage]);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen((prev) => !prev);

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
            ? `${topNavClass} fixed left-0 w-full z-[100] flex flex-col md:flex-row justify-between items-center md:px-10 px-4 py-2 sm:py-2 transition-all duration-300 ${bgClass}`
            : `fixed ${topNavClass} left-0 w-full z-[100] flex flex-col md:flex-row justify-between items-center md:px-10 px-4 py-2 sm:py-2 transition-all duration-300 ${bgClass}`
        }
      >
        {/* Mobile Logo Row */}
        <div className="md:hidden w-full flex justify-center pb-2 pt-1 border-b border-[#1F4A40] dark:border-[#D8E3B1]">
          <Link to="/">
            <img
              src={
                isScrolled
                  ? theme === "dark"
                    ? "/logo2.svg"
                    : "/3.webp"
                  : theme === "dark"
                    ? "/logo2.svg"
                    : "/3.webp"
              }
              alt="logo"
              className="h-11 sm:h-12 object-contain"
            />
          </Link>
        </div>
        {/* Desktop Left Section: Hamburger and Logo */}
        <div className="hidden md:flex items-center space-x-4">
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
          <Link to="/" className="flex items-center">
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
              className={`object-contain transition-all duration-500 origin-left ${isScrolled
                ? "h-8 sm:h-10 md:h-16 scale-100"
                : "h-8 sm:h-10 md:h-16 scale-[1.3] sm:scale-[1.5] md:scale-[1.8] lg:scale-[2]"
                }`}
            />
          </Link>
        </div>


        {/* Icons Row (Mobile: evenly spaced full width, Desktop: right aligned) */}
        <div className="flex items-center justify-between w-full md:w-auto md:space-x-5 pt-1 md:pt-0">
          
          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className={`md:hidden text-3xl font-bold ${isScrolled
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
            {/*<a 
              href="https://ai.studio/apps/3a0b15aa-76c9-4448-91d8-8e16166c2c97?fullscreenApplet=true"
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full border transition-colors flex items-center gap-1 ${
                theme === "light" 
                  ? "border-black text-black hover:bg-black hover:text-white" 
                  : "border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              ✨ Try Out
            </a>*/}

            <button onClick={toggleTheme} className="text-4xl rounded-full">
              <img
                src="/home/navbar/light_icon1.svg"
                alt={`${theme} mode icon`}

                className={`scale-[0.85] md:scale-100 transform origin-center ${
                  theme === "light" && !isScrolled
                    ? "black-icon"
                    : theme === "dark" && !isScrolled
                      ? "white-icon"
                      : theme === "light" && isScrolled
                        ? "black-icon"
                        : theme === "dark" && isScrolled
                          ? "white-icon" : ""
                }`}
              />
            </button>

            <Link to="/feed" className="flex items-center">
              <MdOutlineOndemandVideo 
                className={`scale-[0.85] md:scale-100 transform origin-center w-8 h-8 ${
                  theme === "light" && !isScrolled
                    ? "text-black"
                    : theme === "dark" && !isScrolled
                      ? "text-white"
                      : theme === "light" && isScrolled
                        ? "text-black"
                        : theme === "dark" && isScrolled
                          ? "text-white" : ""
                }`} 
              />
            </Link>

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
                src="/home/navbar/user.svg"
                alt="user icon"
                className={`scale-[0.85] md:scale-100 transform origin-center ${
                  theme === "light" && !isScrolled
                    ? "black-icon"
                    : theme === "dark" && !isScrolled
                      ? "white-icon"
                      : theme === "light" && isScrolled
                        ? "black-icon"
                        : theme === "dark" && isScrolled
                          ? "white-icon" : ""
                }`}
              />
            </button>

            <Link to="/wishlist" className="relative flex items-center justify-center p-1">
              <FaRegHeart 
                size={21}
                className={`scale-[0.85] md:scale-100 transform origin-center ${
                  theme === "light" && !isScrolled
                    ? "text-black"
                    : theme === "dark" && !isScrolled
                      ? "text-white"
                      : theme === "light" && isScrolled
                        ? "text-black"
                        : theme === "dark" && isScrolled
                          ? "text-white" : ""
                }`} 
              />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center text-[9px] text-white font-bold border border-white dark:border-black">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <CartIcon theme={theme} />

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              className="flex items-center justify-center p-1"
              aria-label="Open Chatbot"
            >
              <img src="/cat.gif" alt="Open Chat" className="w-10 h-10 object-contain drop-shadow-sm scale-[1.3] md:scale-[1.8] transition-transform md:hover:scale-[2]" />
            </button>
        </div>
      </nav>

      {/* SliderNavbar (Mobile Menu) - This remains untouched and should work as before */}
      <SliderNavbar isOpen={isOpen} toggleMenu={toggleMenu} allCollections={allCollections} />
      <Suspense fallback={null}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </Suspense>
    </div>
  );
};

export default Navbar;