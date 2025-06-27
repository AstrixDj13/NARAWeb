import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import LoginImage from "../../assets/LoginImage.jpg";
import LoginMobile from "../../assets/loginMobile.jpg";
import logo from "../../assets/NaraLogo.png";
import { MuiTelInput } from "mui-tel-input";
import SignupApi from "../../apis/SignupApi";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function SignupSection() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [actualPhone, setActualPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValidated, setIsFormValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email validation regex
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Password validation (at least 6 characters)
  const validatePassword = (password) => {
    return password.length >= 5;
  };

  // Name validation (more than 3 characters)
  const validateName = (name) => {
    return name.trim().length > 3;
  };

  // Phone number validation (exactly 10 digits)
  const validatePhone = (phone) => {
    return phone.length === 10;
  };

  // Form validation function
  const validateForm = () => {
    if (
      validateName(name) &&
      validatePhone(actualPhone) &&
      validateEmail(email) &&
      validatePassword(password)
    ) {
      setIsFormValidated(true);
    } else {
      setIsFormValidated(false);
    }
  };

  // Validate the form when any field changes
  useEffect(() => {
    validateForm();
  }, [name, actualPhone, email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValidated) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await SignupApi({
        name,
        phone,
        email,
        password,
      });
      toast.success("Signup successful!");
      console.log("Signup successful:", response);
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed: " + error.message);
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[100%] xl:h-screen dark:text-[#ffff] flex lg:flex-row flex-col font-antikor">
      <div className="lg:w-[50%] h-full object-cover lg:fixed">
        <div className="hidden w-full h-full p-10 md:p-8 md:flex justify-center items-center bg-white dark:!bg-black relative">
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
          className="h-full w-full object-cover lg:hidden"
          alt=""
        />
      </div>
      <div className="lg:w-[50%] lg:ml-[50%] min-h-full px-8 py-16 flex justify-center items-center ">
        <div className="max-w-[480px] flex-col flex gap-[30px]">
          <div className="w-full h-full flex flex-col gap-[10px]">
            {/* Breadcrumb */}
            <div className="flex gap-2 ">
              <Link className="underline" to={"/"}>
                {" "}
                Home
              </Link>{" "}
              <img title="image" src="/icons/leftTriangleIcon.svg" alt="icon" />
              <span>Signup</span>
            </div>
            <p className="font-extrabold text-2xl">Welcome to</p>
            <div>
              <Link className="cursor-pointer" to="/">
                <img
                  title="image"
                  src={logo}
                  alt="logo"
                  className="w-[200px] lg:w-[300px]"
                />
              </Link>
            </div>
            <p className="font-light lg:text-xl text-md mt-2">
              Today is a new day. It's your day. You shape it. You style it. Be
              the best version of yourself
            </p>
          </div>
          <div className="w-full h-full flex flex-col gap-[10px]">
            <div className="w-full">
              <p className="text-[#626262] text-sm dark:text-[#ffff]">
                Your Name*
              </p>
              <input
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2 border-1 border-[#A7A7A766] bg-[#F7F7F7] text-black w-full"
                type="text"
                value={name}
              />
              {!validateName(name) && name && (
                <p className="text-red-600 text-sm">
                  Name must be more than 3 characters
                </p>
              )}
            </div>
            <div className="">
              <p className="text-[#626262] text-sm dark:text-[#ffff]">
                Phone Number*
              </p>
              <MuiTelInput
                value={phone}
                required={true}
                onChange={(enteredNumber, info) => {
                  setPhone(enteredNumber);
                  setActualPhone(info.nationalNumber);
                  setCountry(`+${info.countryCallingCode}`);
                }}
                name="phone"
                id="phone"
                placeholder="Phone*"
                defaultCountry="IN"
                size="small"
                variant="outlined"
                className="w-full bg-[#F7F7F7] border-3"
              />
              {!validatePhone(actualPhone) && actualPhone && (
                <p className="text-red-600 text-sm">
                  Phone number must be 10 digits
                </p>
              )}
            </div>
            <div className="w-full">
              <p className="text-[#626262] dark:text-[#ffff] text-sm">
                Email Id*
              </p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 border-1 border-[#A7A7A766] text-black bg-[#F7F7F7] w-full"
                type="text"
                value={email}
              />
              {!validateEmail(email) && email && (
                <p className="text-red-600 text-sm">Invalid email format</p>
              )}
            </div>
            <div>
              <p className="text-[#626262] text-sm dark:text-[#ffff]">
                Password*
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
              {password && !validatePassword(password) && (
                <p className="text-red-600 text-sm">
                  Password must be at least 5 characters long
                </p>
              )}
            </div>

            {/* Privary Policy and terms and conditions clause */}
            <p className="text-xs text-center tracking-tighter">
              By Signing up , I agree to{" "}
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
              onClick={handleSubmit}
              className="disabled:bg-gray-500 bg-[#1F4A40] text-white font-semibold px-2 py-2 mt-2"
              disabled={!isFormValidated}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </div>
          {/* <div className="flex items-center gap-2 justify-center">
            <div className="py-[0.5px] bg-[#CFDFE2] w-full"></div>
            <p>Or</p>
            <div className="py-[0.5px] bg-[#CFDFE2] w-full"></div>
          </div>
          <div>
            <button className="font-semibold px-2 py-2 w-full bg-blue-50">
              Sign up with Google
            </button>
          </div> */}
          <div className="flex gap-1 justify-center">
            Already have an account?
            <Link
              className="underline text-[#1F4A40] dark:text-green-500 font-semibold"
              to="/login"
            >
              Login
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupSection;
