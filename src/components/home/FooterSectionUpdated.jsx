import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../../apis/Collections";
import backendApi from "../../utils/backendApi";
import "@fortawesome/fontawesome-free/css/all.min.css"; // For social media icons
import { toast } from "sonner";

const FooterSection = () => {

  const [allCollections, setAllCollections] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await backendApi.post("/api/newsletter", { email });
      toast.success(response.data.message || "Successfully subscribed!");
      setEmail("");
    } catch (error) {
      console.error("Newsletter error:", error);
      const errorMessage = error.response?.data?.error || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const allCollections = await getCollections();
      console.log(allCollections);
      setAllCollections(allCollections.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // The scrollToTop function is still useful, keep it.
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    // Main container for the footer with dark background
    <div className="bg-[#1C1C1C] text-white pt-10 pb-4 text-sm relative"> {/* Adjusted background and padding */}

      {/* Optional: Scroll up button - repositioned it for common footer placement */}
      {/* You can choose to keep this or remove it entirely if the design doesn't need it */}
      <div className="flex justify-center mb-8">
        <div
          className="text-[#6C757D] text-sm cursor-pointer flex items-center"
          onClick={scrollToTop}
        >
          <p className="inline-block mr-2">Scroll up</p>
          <i className="fas fa-chevron-up text-xl"></i>
        </div>
      </div>


      {/* Main footer content grid */}
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-y-8 gap-x-4">

        {/* Column 1: SHOP */}
        <div>
          <h3 className="font-bold mb-4 uppercase">Shop</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to={
                  allCollections.length === 0
                    ? "#"
                    : `/collection?id=${encodeURIComponent(allCollections[0].id)}`
                }
                className="hover:underline"
              >
                New In
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:underline">
                All Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2: INFORMATION */}
        {/*<div>
          <h3 className="font-bold mb-4 uppercase">Information</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Faq</a></li>
            <li><a href="#" className="hover:underline">Shipping</a></li>
            <li><a href="#" className="hover:underline">Policies</a></li>
            <li><a href="#" className="hover:underline">Legal</a></li>
            <li><a href="#" className="hover:underline">Track My Order</a></li>
          </ul>
        </div>*/}

        {/* Column 3: DISCOVER */}
        {/*<div>
          <h3 className="font-bold mb-4 uppercase">Discover</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">Edits</a></li>
            <li><a href="#" className="hover:underline">Testimonials</a></li>
            <li><a href="#" className="hover:underline">In The News</a></li>
            <li><a href="#" className="hover:underline">Career</a></li>
          </ul>
        </div>*/}

        {/* Column 4: CONTACT US & SOCIAL */}
        <div>
          <h3 className="font-bold mb-4 uppercase">Contact Us</h3>
          <ul className="space-y-2 mb-6">
            {/*<li className="flex items-center"><i className="fas fa-map-marker-alt mr-2"></i> S-07-3, PI No 88-91, Haware Centurion Mall, Navi Mumbai-400706, India</li>*/}
            {/*<li className="flex items-center"><i className="fas fa-envelope mr-2"></i> info@narawear.com</li>*/}
            <li className="flex items-center">
              <i className="fas fa-map-marker-alt mr-2"></i>
              <a
                href={
                  (() => {
                    // Coordinates for Haware Centurion Mall
                    const lat = "19.0247";
                    const lng = "73.0221";
                    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                    return isIOS
                      ? `https://maps.apple.com/?q=${lat},${lng}`  // ← Apple Maps for iOS
                      : `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`; // ← Google Maps for others
                  })()
                }
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                aria-label="Open location in Maps"
                title="Open in Maps"
              >
                S-07-3, PI No 88-91, Haware Centurion Mall, Navi Mumbai-400706, India
              </a>
            </li>


            <li className="flex items-center">
              <i className="fas fa-envelope mr-2"></i>
              <a
                href="mailto:info@narawear.com?subject=Support%20Request&body=Hello%20NARA%20Team,"
                aria-label="Email Nara Wear"
                className="text-inherit hover:underline focus:outline-none"
              >
                info@narawear.com
              </a>
            </li>

          </ul>

          <h3 className="font-bold mb-4 uppercase">Social</h3>
          <div className="flex space-x-4 text-xl"> {/* Increased icon size */}
            {/*<a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><i className="fab fa-facebook"></i></a> */}
            <a href="https://www.instagram.com/narawearr/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><i className="fab fa-instagram"></i></a>
            {/*<a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><i className="fab fa-pinterest"></i></a> */}
            <a href="https://www.linkedin.com/company/narawear" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400"><i className="fab fa-linkedin"></i></a>
            <a
              href="https://wa.me/919930835594"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                title="WhatsApp"
                src="/home/navbar/WhatsApp.svg.webp"
                alt="whatsapp"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>

        {/* Column 5: STAY IN THE LOOP (Subscription) */}
        <div>
          <h3 className="font-bold mb-4 uppercase">Stay in the loop</h3>
          <p className="mb-4 text-xs">Sign up to get exclusive access to launches, secret discounts and more</p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-2"> {/* Changed to flex-col for stacking on small screens */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="p-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1E7B74] text-white font-bold py-3 px-6 hover:bg-[#155A55] transition-colors duration-200 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>

      </div> {/* End main footer content grid */}

      {/* Separator Line */}
      <hr className="border-t border-gray-700 my-8 mx-4 md:mx-8 lg:mx-16" />

      {/* Copyright */}
      <div className="text-center text-xs text-gray-400">
        <p>Copyright © {new Date().getFullYear()} NARA. All rights reserved.</p> {/* Updated year dynamically */}
      </div>

    </div> // End main container for footer
  );
};

export default FooterSection;