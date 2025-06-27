import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Orders/Sidebar";
import ContentArea from "../components/Orders/ContentArea";

export default function Orders() {
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
      />
      <MainContent isMenuOpen={isMenuOpen} />
    </div>
  );
}




function Header({ onBack, onMenuToggle }) {
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
      <div className="border-2 w-12 text-4xl border-[#B5B5B5] flex items-center justify-center  ">
        <button onClick={onBack}>&times;</button>
      </div>
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




