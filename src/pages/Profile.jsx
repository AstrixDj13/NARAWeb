import { useState } from "react";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import AddressesSection from "../components/profile/AddressesSection";
import expandIcon from "../assets/icons/expand.svg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  deleteCart,
  logoutUser,
  setActiveCartId,
  setAuthStatus,
  setCheckoutUrl,
  setProductsinCart,
  setTotalQuantityInCart,
} from "../store";
import { LiaPowerOffSolid } from "react-icons/lia";

export default function Profile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={` h-[100vh] dark:bg-black dark:text-white`}>
      <Header
        onBack={handleBack}
        onMenuToggle={handleMenuToggle}
        isMenuOpen={isMenuOpen}
      />
      <MainContent isMenuOpen={isMenuOpen} />
    </div>
  );
}

function Header({ onBack, onMenuToggle, isMenuOpen }) {
  return (
    <header className="font-bold py-2 px-4 border-b-2 flex justify-between items-center h-[4em]">
      <div className="flex gap-4 items-center">
        <button
          className="lg:hidden text-3xl dark:text-white"
          onClick={onMenuToggle}
        >
          &#9776;
        </button>
        <h1 className="text-2xl font-bold">MY ACCOUNT</h1>
      </div>
      <button
        onClick={onBack}
        className="border-2 w-12 text-4xl border-[#B5B5B5] flex items-center justify-center"
      >
        &times;
      </button>
    </header>
  );
}

function MainContent({ isMenuOpen }) {
  return (
    <main className="flex flex-grow relative dark:bg-black h-[calc(100vh-4em)]">
      <Sidebar isMenuOpen={isMenuOpen} />
      <ContentArea />
    </main>
  );
}

function Sidebar({ isMenuOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    dispatch(logoutUser());
    dispatch(deleteCart());
    localStorage.removeItem("cartId");
    navigate("/");
  };
  return (
    <aside
      className={`absolute lg:relative top-0 bottom-0 transition-transform duration-500 ease-in-out transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 flex flex-col xl:justify-between   lg:w-1/4 w-4/5 dark:bg-black bg-[#ffff] border-r p-4 gap-12`}
    >
      <div>
        <div className="text-sm font-semibold bg-[#D8E3B180] border-l-2 border-l-[#1F4A40] p-2 flex justify-between">
          <h2>Account Details</h2>
          <img title="image" src={expandIcon} alt="expand icon" />
        </div>
        <Link to={"/orders"}>
          <h2 className="text-sm font-semibold border-b-2 p-2">My Orders</h2>
        </Link>
      </div>
      <button
        className="flex items-center justify-center gap-2 font-bold dark:text-[#ffff] border-2 p-1 text-lg"
        onClick={logoutHandler}
      >
        {" "}
        <LiaPowerOffSolid size={24} /> <span>Log out</span>
      </button>
    </aside>
  );
}

function ContentArea() {
  return (
    <section className="flex-grow pt-4 pb-4 pl-8 lg:pr-24 pr-8 lg:w-[calc(100vw-25%)] overflow-y-auto">
      <PersonalInfoSection />
      <AddressesSection />
    </section>
  );
}
