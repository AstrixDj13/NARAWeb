import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NEW_ARRIVALS_URL } from "../../utils/collectionLinks";
import backendApi from "../../utils/backendApi";
import { FaChevronUp, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "sonner";
import { useEventTracker } from "../../hooks/EventTracker";

const FooterSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { trackEvent } = useEventTracker();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await backendApi.post("/api/newsletter", { email });
      trackEvent('Lead', { method: "Footer Newsletter" });
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#1C1C1C] text-white pt-12 pb-6">
      {/* Scroll up button */}
      <div className="flex justify-center mb-10">
        <div
          className="text-gray-400 hover:text-white text-sm cursor-pointer flex items-center transition-colors duration-200"
          onClick={scrollToTop}
        >
          <span className="mr-2">Back to top</span>
          <FaChevronUp />
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Column 1: SHOP */}
          <div>
            <h3 className="font-semibold text-base mb-4 uppercase tracking-wider">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to={NEW_ARRIVALS_URL}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  New In
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: POLICIES */}
          <div>
            <h3 className="font-semibold text-base mb-4 uppercase tracking-wider">Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/return_policies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/exchange_policies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Exchange
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: FOLLOW US & CONTACT */}
          <div>
            <h3 className="font-semibold text-base mb-4 uppercase tracking-wider">Follow Us</h3>
            <div className="flex space-x-5 mb-5">
              <a
                href="https://www.instagram.com/narawearr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://www.linkedin.com/company/narawear"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
            <div>
              <Link
                to="/contact"
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm inline-block"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Column 5: NEWSLETTER */}
          <div>
            <h3 className="font-semibold text-base mb-4 uppercase tracking-wider">Stay in the Loop</h3>
            <p className="mb-4 text-sm text-gray-400 leading-relaxed">
              Sign up to get exclusive access to launches, secret discounts and more
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full p-3 bg-[#2A2A2A] border border-gray-700 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#1E7B74] transition-colors duration-200"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E7B74] text-white font-semibold py-3 px-6 hover:bg-[#155A55] transition-colors duration-200 uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Separator Line */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <hr className="border-t border-gray-800 my-8" />
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500">
        <p>NARA is a fashion brand operated by Aaishka Industries Private Limited.</p>
      </div>
    </div>
  );
};

export default FooterSection;