import React, { useState, useEffect } from "react";
import SliderNavbar from "./SliderNavbar";
import CartIcon from "../CartIcon";
import { useDispatch } from "react-redux";
import { setAppTheme } from "../../store";
import { Link } from "react-router-dom";
import { MdOutlineOndemandVideo } from "react-icons/md";

const NavbarRelative = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    dispatch(setAppTheme(newTheme));
  };
  return (
    <div>
      {/* Top Navbar */}
      <div className="top-0 left-0 w-full z-50 flex justify-between items-center bg-white text-black dark:!bg-black dark:!text-white md:px-10 px-4 py-2 xl:!py-4 bg-opacity-80 fixed shadow-md md:shadow-none">
        
        {/* Left Section (Hamburger + Logo) */}
        <div className="flex items-center space-x-4">
          <button
            className="text-3xl sm:text-4xl flex items-center font-bold text-black dark:!text-white"
            onClick={toggleMenu}
          >
            &#9776;
          </button>
          <Link to="/">
            <img
              title="image"
              src={theme === "light" ? "/logo.svg" : "/logo2.svg"}
              className="w-32 sm:w-40 md:w-48"
              alt="logo"
            />
          </Link>
        </div>

        {/* Icons Row */}
        <div className="flex items-center space-x-3 md:space-x-7">
          <button
            onClick={toggleTheme}
            className="w-8 h-8 leading-9 text-4xl rounded-full m-1 text-black dark:!text-white"
          >
            {theme == "light" ? (
              <img
                title="image"
                src="/home/navbar/light_icon1.svg"
                alt="light mode icon"
              />
            ) : (
              <img
                title="image"
                src="/home/navbar/icon4.svg"
                className="white-icon"
                alt="/light mode icon"
              />
            )}
          </button>
          {theme == "light" ? (
            <>
              <Link to="/profile">
                <img
                  title="image"
                  src="/home/navbar/user.svg"
                  alt="light mode icon"
                />
              </Link>
              <CartIcon theme={theme} />
            </>
          ) : (
            <>
              <Link to={"/profile"}>
                <img
                  title="image"
                  src="/home/navbar/user.svg"
                  className="white-icon"
                  alt="light mode icon"
                />
              </Link>
              <CartIcon theme={theme} />
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <SliderNavbar isOpen={isOpen} toggleMenu={toggleMenu} />
    </div>
  );
};

export default NavbarRelative;
