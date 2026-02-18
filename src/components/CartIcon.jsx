import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CartIcon({ theme, OnHomePageHeroSection }) {
  const navigate = useNavigate();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <>
      <div className="relative cursor-pointer  " onClick={handleCartClick}>
        <div
          className={`absolute z-50 bg-black ${OnHomePageHeroSection ? "!bg-[#ffff] !text-black" : null
            }  dark:!bg-[#fff] text-[#fff] dark:text-black text-[70%] p-0 rounded-full flex items-center justify-center top-0 right-0 w-4 h-4 `}
        >
          <span>{totalQuantity <= 9 ? totalQuantity : "9+"}</span>
        </div>
        <img
          title="image"
          src="/home/navbar/shoppingCart.svg"
          className={`${OnHomePageHeroSection
            ? "white-icon"
            : theme === "dark" && "white-icon"
            }`}
          alt="light mode icon"
        />
      </div>
    </>
  );
}
