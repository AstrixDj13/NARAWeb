import NavbarRelative from "../components/Navbar/NavbarRelative";

export default function BehindTheScreen() {
  return (
    <div className="dark:bg-black dark:p-1">
      <NavbarRelative />
      <img
        title="image"
        src="/home/behind.webp"
        className="mt-[78px] w-full "
        alt=""
      />
    </div>
  );
}
