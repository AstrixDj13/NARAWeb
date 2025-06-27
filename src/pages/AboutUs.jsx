import React from "react";
import Navbar2 from "../components/Navbar/Navbar2";
import TopSection from "../components/about/TopSection";
import FabricStorySection from "../components/about/FabricStorySection";
import FooterSection from "../components/home/FooterSection";
import NavbarRelative from "../components/Navbar/NavbarRelative"

const AboutUs = () => {
  return (
    <div className="dark:!bg-black ">
      <NavbarRelative />
      <TopSection />
      <FabricStorySection />
      <FooterSection />
    </div>
  );
};

export default AboutUs;
