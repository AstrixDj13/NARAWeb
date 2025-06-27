import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import LoginImage from "../../assets/LoginImage.jpg";
import LoginMobile from "../../assets/loginMobile.jpg";
import logo from "../../assets/NaraLogo.png";
import LoginApi from "../../apis/LoginApi";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaEye } from "react-icons/fa";
import {
  deleteCart,
  setActiveCartId,
  setAuthStatus,
  setCheckoutUrl,
  setProductsinCart,
  setTotalQuantityInCart,
} from "../../store";
import { ToastContainer, toast as toastifyToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SendRecoveryEmailAPI } from "../../apis/CustomerAPI";
import { FaEyeSlash } from "react-icons/fa6";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
function LoginSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const userData = { email, password };
    try {
      const accessToken = await LoginApi(userData);
      toast.success("Login successful!");
      dispatch(setAuthStatus({ accessToken, isAuthenticated: true }));
      dispatch(deleteCart());
      localStorage.removeItem("cartId");

      navigate("/");
    } catch (error) {
      if (error.message.includes("Unidentified customer")) {
        toast.error("Either the email or the password is incorrect!");
      } else {
        toast.error("Login failed: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim().length === 0 || !emailRegex.test(email)) {
      toastifyToast("Please enter a valid email address!");
      return;
    }

    try {
      const response = await SendRecoveryEmailAPI(email);

      if (response) {
        toastifyToast(
          "An email with the account recovery link has been sent to you. Please follow the link to reset your password."
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="dark:text-[#ffff]  relative w-[100%] xl:h-screen flex lg:flex-row flex-col font-antikor">
      <ToastContainer
        position="bottom-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={localStorage.getItem("theme") === "dark" ? "light" : "dark"}
      />
      {/* Same as */}

      <div className="lg:w-[50%] h-full object-cover">
        <div className="hidden w-full h-full p-10 md:p-8 lg:flex justify-center items-center bg-white dark:!bg-black relative">
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
                src={LoginImage}
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
        <img
          title="image"
          src={LoginMobile}
          alt="Product"
          className="h-full w-full object-cover lg:hidden"
        />
      </div>
      <div className="lg:w-[50%] h-full px-8 py-16 flex justify-center items-center">
        <div className="max-w-[480px] flex-col flex gap-[30px]">
          <div className="w-full h-full flex flex-col gap-[10px]">
            {/* Breadcrumb */}
            <div className="flex gap-2 ">
              <Link className="underline" to={"/"}>
                {" "}
                Home
              </Link>{" "}
              <img title="image" src="/icons/leftTriangleIcon.svg" alt="" />
              <span>Login</span>
            </div>
            <p className="font-extrabold text-2xl">Welcome to</p>
            <div>
              <Link to={"/"} className="cursor-pointer">
                <img
                  title="image"
                  src={logo}
                  alt="logo"
                  className="w-[200px] lg:w-[300px]"
                />
              </Link>
            </div>{" "}
            <p className="font-light lg:text-xl text-md mt-2">
              Today is a new day. It's your day. You shape it. You style it. Be
              the best version of yourself
            </p>
          </div>{" "}
          <div className="w-full h-full flex flex-col gap-[10px]">
            <div className="w-full">
              <p className="text-[#626262] text-sm dark:text-[#ffff]">
                Email Id
              </p>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="text-black px-4 py-2 border-1 border-[#A7A7A766] bg-[#F7F7F7] w-full"
                type="text"
              />
            </div>{" "}
            <div>
              <p className="text-[#626262] text-sm dark:text-[#ffff]">
                Password
              </p>
              <div className="relative w-full">
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  className="text-black px-4 py-2 border-1 border-[#A7A7A766] bg-[#F7F7F7] w-full"
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  type="button"
                  className="text-black absolute right-3 top-2 text-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <FaRegEyeSlash size={24} />
                  ) : (
                    <FaRegEye size={24} />
                  )}
                </button>
              </div>
            </div>
            <p
              onClick={handleForgotPassword}
              className="dark:text-[#1F4A40] hover:underline cursor-pointer inline  w-fit ml-auto text-[#1F4A40] "
            >
              Forgot Password?
            </p>
            {/* Privary Policy and terms and conditions clause */}
            <p className="text-xs tracking-tight text-center">
              By Signing in , I agree to{" "}
              <Link
                className="text-indigo-500 underline"
                to="https://docs.google.com/document/d/1D4n_mgSz9K1yVEFgDhKrTQdfdb3zUPlkpQNf8AxjBUI/edit?usp=sharing"
              >
                Terms and Conditions
              </Link>{" "}
              and{" "}
              <Link
                className="text-indigo-500 underline"
                to="https://docs.google.com/document/d/1D4n_mgSz9K1yVEFgDhKrTQdfdb3zUPlkpQNf8AxjBUI/edit?usp=sharing"
              >
                Privacy Policy{" "}
              </Link>
            </p>
            <button
              onClick={handleLogin}
              className="bg-[#1F4A40] text-white font-semibold px-2 py-2"
            >
              {isLoading ? "Logging In..." : "Log In"}
            </button>
          </div>
          {/* <div className="flex items-center gap-2 justify-center">
            <div className="py-[0.5px] bg-[#CFDFE2] w-full"></div>
            <p>Or</p>
            <div className="py-[0.5px] bg-[#CFDFE2] w-full"></div>
          </div>
          <div>
            {" "}
            <button className="font-semibold px-2 py-2 w-full bg-blue-50">
              Sign in with Google
            </button>
          </div> */}
          <div className="flex gap-1 justify-center">
            Dont have an account?
            <Link
              className="text-[#1F4A40] dark:text-green-500 font-semibold underline"
              to="/signup"
            >
              Sign Up
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSection;
