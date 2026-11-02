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
      <button
        type="button"
        aria-label={`Shopping cart with ${totalQuantity || 0} items`}
        className="relative cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center bg-transparent border-none p-0"
        onClick={handleCartClick}
      >
        <div
          className={`absolute z-50 bg-black ${OnHomePageHeroSection ? "!bg-[#ffff] !text-black" : null
            }  dark:!bg-[#fff] text-[#fff] dark:text-black text-[70%] p-0 rounded-full flex items-center justify-center top-0 right-0 w-4 h-4 `}
        >
          <span>{totalQuantity <= 9 ? totalQuantity : "9+"}</span>
        </div>
        <img
          title="image"
          src="/home/navbar/shoppingCart.svg"
          width="24"
          height="24"
          className={`scale-[0.85] md:scale-100 transform origin-center ${OnHomePageHeroSection
            ? "white-icon"
            : theme === "dark" && "white-icon"
            }`}
          alt="Shopping Cart"
        />
      </button>
    </>
  );
}
