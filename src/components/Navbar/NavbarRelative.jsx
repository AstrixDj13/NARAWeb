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
      <div className="top-0 left-0 w-full z-50 flex flex-col md:flex-row justify-between items-center bg-white dark:!bg-black md:px-10 px-4 py-2 xl:!py-4 bg-opacity-80 fixed shadow-sm md:shadow-none">
        
        {/* Mobile Logo Row */}
        <div className="md:hidden w-full flex justify-center pb-2 pt-1 border-b border-[#1F4A40] dark:border-[#D8E3B1]">
          <Link to="/">
            <img
              title="image"
              src="/logo.svg"
              className="h-11 sm:h-12 object-contain"
              alt="logo"
            />
          </Link>
        </div>

        {/* Desktop Left Section (Hamburger + Logo) */}
        <div className="hidden md:flex items-center">
          <button
            className="text-4xl flex mt-[10px] items-center font-bold text-black dark:!text-white"
            onClick={toggleMenu}
          >
            &#9776;
          </button>
          <Link to="/">
            <img
              title="image"
              src="/logo.svg"
              className="w-48 md:ml-10 ml-4"
              alt="logo"
            />
          </Link>
        </div>

        {/* Icons Row (Mobile: evenly spaced full width, Desktop: right aligned) */}
        <div className="flex items-center justify-between w-full md:w-auto md:space-x-7 pt-2 md:pt-0">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-3xl flex items-center font-bold text-black dark:!text-white"
            onClick={toggleMenu}
          >
            &#9776;
          </button>

          <button
            onClick={toggleTheme}
            className="w-8 h-8 leading-9 text-4xl rounded-full m-1 text-[#1F4A40] dark:!text-white"
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
