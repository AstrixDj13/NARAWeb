import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import SliderNavbar from "./SliderNavbar";
import CartIcon from "../CartIcon";
import { useDispatch } from "react-redux";
import { setAppTheme } from "../../store";
import { getCollections } from "../../apis/Collections";
import { getActiveCampaigns } from "../../utils/campaignUtils";

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
            ? `${topNavClass} fixed left-0 w-full z-[100] flex justify-between items-center md:px-10 pl-4 pr-2 py-2 sm:py-2 transition-all duration-300 ${bgClass}`
            : `fixed ${topNavClass} left-0 w-full z-[100] flex justify-between items-center md:px-10 pl-4 pr-2 py-2 sm:py-2 transition-all duration-300 ${bgClass}`
        }
      >
        {/* Left Section: Hamburger and Logo */}
        <div className="flex items-center space-x-4">
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
                  ? "h-8 sm:h-10 md:h-12 scale-100"
                  : "h-8 sm:h-10 md:h-12 scale-[1.3] sm:scale-[1.5] md:scale-[1.8] lg:scale-[2]"
                }`}
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
                src="/home/navbar/user.svg"
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

            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
              className="flex items-center justify-center p-1"
              aria-label="Open Chatbot"
            >
              <img src="/cat.gif" alt="Open Chat" className="w-10 h-10 object-contain drop-shadow-sm scale-[1.6] md:scale-[1.8] transition-transform hover:scale-[1.8] md:hover:scale-[2]" />
            </button>

            <CartIcon theme={theme} />
          </div>
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