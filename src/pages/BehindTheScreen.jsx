import NavbarRelative from "../components/Navbar/NavbarRelative";
import Breadcrumb from "../components/common/Breadcrumb";

export default function BehindTheScreen() {
  return (
    <div className="dark:bg-black dark:p-1">
      <NavbarRelative />
      <div className="px-6 md:px-12 lg:px-20 pt-32">
        <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Behind The Screen" }]} />
      </div>
      <img
        title="image"
        src="/home/behind.webp"
        className="mt-[78px] w-full "
        alt=""
      />
    </div>
  );
}
