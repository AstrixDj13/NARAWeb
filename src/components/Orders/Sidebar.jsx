import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setAuthStatus } from "../../store";
import { LiaPowerOffSolid } from "react-icons/lia";
import expandIcon from "../../assets/icons/expand.svg";
export default function Sidebar({ isMenuOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    dispatch(setAuthStatus({ setAccessToken: null, isAuthenticated: false }));

    navigate("/");
  };
  return (
    <aside
      className={`absolute z-[10000] lg:relative top-0 bottom-0 transition-transform duration-500 ease-in-out transform ${
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 flex flex-col xl:justify-between   lg:w-1/4 w-4/5 dark:bg-black bg-[#ffff] border-r p-4 gap-12`}
    >
      <div>
        <Link to={"/profile"}>
          <h2 className="text-sm font-semibold border-b-2 p-2">
            Account Details
          </h2>
        </Link>

        <div className="text-sm font-semibold bg-[#D8E3B180] border-l-2 border-l-[#1F4A40] p-2 flex justify-between">
          <h2>My Orders</h2>
          <img title="image" src={expandIcon} alt="expand icon" />
        </div>
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
