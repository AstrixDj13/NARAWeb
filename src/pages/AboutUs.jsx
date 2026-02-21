import React from "react";
import Navbar2 from "../components/Navbar/Navbar2";
import TopSection from "../components/about/TopSection";
import FabricStorySection from "../components/about/FabricStorySection";
import FooterSection from "../components/home/FooterSectionUpdated";
import NavbarRelative from "../components/Navbar/NavbarRelative"

import Breadcrumb from "../components/common/Breadcrumb";

const AboutUs = () => {
  return (
    <div className="dark:!bg-black ">
      <NavbarRelative />
      <div className="px-6 md:px-12 lg:px-20 pt-32">
        <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "About Us" }]} />
      </div>
      <TopSection />
      <FabricStorySection />
      <FooterSection />
    </div>
  );
};

export default AboutUs;
