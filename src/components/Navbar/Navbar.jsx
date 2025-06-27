import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SliderNavbar from "./SliderNavbar";
import CartIcon from "../CartIcon";
import { useDispatch } from "react-redux";
import { setAppTheme } from "../../store";
import { getCollections } from "../../apis/Collections";

const Navbar = () => {
  const dispatch = useDispatch();
  const [collections, setCollections] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement;

  // Fetch collections from API
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
      const hero = document.querySelector(".carousel-inner");
      const offset = hero ? hero.offsetHeight - 100 : 50;
      setIsScrolled(window.pageYOffset > offset);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const bgClass = isScrolled
    ? theme === "light"
      ? "bg-white text-black"
      : "bg-black text-white"
    : theme === "light"
    ? "bg-transparent text-black"
    : "bg-transparent text-white";

  return (
    <div className="relative">
      <nav
        className={
          !isScrolled
            ? `top-5 fixed  left-0 w-full z-50 flex justify-between items-center md:px-10 pl-4 pr-2 py-4 transition-colors duration-300 ${bgClass}`
            : `fixed top-0 left-0 w-full z-50 flex justify-between items-center md:px-10 pl-4 pr-2 py-4 transition-colors duration-300 ${bgClass}`
        }
      >
        <div className="flex items-center space-x-4">
          <button onClick={toggleMenu} className="text-4xl font-bold">
            &#9776;
          </button>
          <Link to="/" className="flex-shrink-0 w-[500px]">
            <img
              src={
                isScrolled
                  ? theme === "dark"
                    ? "/logo2.svg"
                    : "/logo.svg"
                  : "/logo2.svg"
              }
              alt="logo"
              className={
                isScrolled
                  ? "h-[70px] -mt-4"
                  : "xl:h-[170px] lg:h-[140px] md:h-[100px] h-[80px] sm:absolute md:-top-3 lg:-top-8"
              }
            />
          </Link>

          {/* Collections Hover Dropdown */}
        </div>
        <div className="flex gap-6">
          <div className="relative group">
            <button className="flex items-center px-4 py-2 rounded hover:bg-gray-200 dark:!hover:bg-gray-700 transition text-[#1F4A40]">
              <span className="mr-2 font-medium text-[#1F4A40]">
                Browse Collections
              </span>
              {/* Down Arrow Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-gray-700 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full left-0 w-54 bg-white dark:!bg-gray-800 shadow-lg rounded hidden group-hover:block z-50">
              <ul>
                {collections.map((col) => (
                  <li key={col.id}>
                    <Link
                      to={`/collection?id=${col.id}`}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {col.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center md:space-x-5 space-x-2">
            <button onClick={toggleTheme} className="text-4xl rounded-full">
              <img
                src="/home/navbar/light_icon1.svg"
                alt={`${theme} mode icon`}
                className={theme === "light" && !isScrolled ? "white-icon" : ""}
              />
            </button>

            <Link to="/profile">
              <img
                src="home/navbar/user.svg"
                alt="user icon"
                className={theme === "dark" || !isScrolled ? "white-icon" : ""}
              />
            </Link>

            <CartIcon theme={theme} OnHomePageHeroSection={!isScrolled} />
          </div>
        </div>
      </nav>

      <SliderNavbar isOpen={isOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default Navbar;
