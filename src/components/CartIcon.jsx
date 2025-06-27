import { useState } from "react";
import Cart from "./Cart/Cart";
import { useSelector } from "react-redux";
export default function CartIcon({ theme, OnHomePageHeroSection }) {
  const [cartOpen, setCartOpen] = useState(false);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const toggleCartOpen = () => {
    setCartOpen((state) => !state);
  };
  return (
    <>
      <div className="relative cursor-pointer  " onClick={toggleCartOpen}>
        <div
          className={`absolute z-50 bg-black ${
            OnHomePageHeroSection ? "!bg-[#ffff] !text-black" : null
          }  dark:!bg-[#fff] text-[#fff] dark:text-black text-[70%] p-0 rounded-full flex items-center justify-center top-0 right-0 w-4 h-4 `}
        >
          <span>{totalQuantity <= 9 ? totalQuantity : "9+"}</span>
        </div>
        <img
          title="image"
          src="/home/navbar/shoppingCart.svg"
          className={`${
            OnHomePageHeroSection
              ? "white-icon"
              : theme === "dark" && "white-icon"
          }`}
          alt="light mode icon"
        />
      </div>

      <Cart toggleCartOpen={toggleCartOpen} cartOpen={cartOpen} />
    </>
  );
}
