import React from "react";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import Breadcrumb from "../components/common/Breadcrumb";
import FooterSection from "../components/home/FooterSectionUpdated";
import { FaMapMarkerAlt, FaEnvelope, FaWhatsapp, FaPhoneAlt, FaClock, FaBuilding, FaExternalLinkAlt } from "react-icons/fa";

const ContactUs = () => {
  const mapCoordinates = {
    lat: "19.0247",
    lng: "73.0221",
    query: "Haware Centurion Mall, Sector 19A, Nerul, Navi Mumbai, Maharashtra 400706"
  };

  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const mapUrl = isIOS
    ? `https://maps.apple.com/?q=${encodeURIComponent(mapCoordinates.query)}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapCoordinates.query)}`;

  const embedMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapCoordinates.query)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-[#FAF9F5] dark:bg-black text-[#1a1a1a] dark:text-[#f3f3f3] min-h-screen flex flex-col font-sans">
      <NavbarRelative />

      <main className="flex-grow max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-28 pb-16 w-full">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Contact Us" }]} />
        </div>

        {/* Header Title */}
        <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 font-antikor uppercase">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl leading-relaxed">
            Have a question about an order, sizing, styling advice, or custom inquiries? We’re here to help you every step of the way.
          </p>
        </div>

        {/* Main Content Grid: Information + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Cards (7 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Address Card */}
            <div className="bg-white dark:bg-[#181818] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1E7B74]/10 dark:bg-[#1E7B74]/20 flex items-center justify-center flex-shrink-0 text-[#1E7B74]">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-base uppercase tracking-wider text-gray-900 dark:text-white">
                    Our Location
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    S-07-3, Pl No 88-91, Haware Centurion Mall,
                    <br />
                    Sector 19A, Nerul, Navi Mumbai - 400706,
                    <br />
                    Maharashtra, India
                  </p>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#1E7B74] hover:underline pt-2"
                  >
                    Open in Maps <FaExternalLinkAlt className="text-[10px]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Communication Channels */}
            <div className="bg-white dark:bg-[#181818] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md space-y-5">
              <h3 className="font-bold text-base uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800 pb-3">
                Get in Touch
              </h3>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-700 dark:text-gray-300">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Email Us</p>
                  <a
                    href="mailto:info@narawear.com?subject=Inquiry%20via%20Website"
                    className="text-sm font-semibold text-[#1a1a1a] dark:text-white hover:text-[#1E7B74] transition-colors"
                  >
                    info@narawear.com
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-600">
                  <FaWhatsapp className="text-lg" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">WhatsApp Support</p>
                  <a
                    href="https://wa.me/919326472754?text=Hello%20NARA%20Team,%20I%20have%20an%20inquiry."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#1a1a1a] dark:text-white hover:text-[#1E7B74] transition-colors"
                  >
                    +91 93264 72754
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-700 dark:text-gray-300">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Call Us</p>
                  <a
                    href="tel:+919326472754"
                    className="text-sm font-semibold text-[#1a1a1a] dark:text-white hover:text-[#1E7B74] transition-colors"
                  >
                    +91 93264 72754
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours & Business Entity */}
            <div className="bg-white dark:bg-[#181818] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-700 dark:text-gray-300">
                  <FaClock />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Operating Hours</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    Monday – Saturday: 10:00 AM – 7:00 PM IST
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">Sunday: Closed</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-700 dark:text-gray-300">
                  <FaBuilding />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Corporate Entity</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    NARA is a fashion brand operated by <span className="font-semibold text-gray-900 dark:text-white">Aaishka Industries Private Limited</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Embed (7 cols) */}
          <div className="lg:col-span-7 h-full">
            <div className="bg-white dark:bg-[#181818] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-full flex flex-col">
              <div className="flex items-center justify-between px-2 pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
                <span className="font-bold text-sm uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#1E7B74]" /> Map Location
                </span>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#1E7B74] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  View Large Map <FaExternalLinkAlt className="text-[9px]" />
                </a>
              </div>
              <div className="w-full flex-grow min-h-[420px] lg:min-h-[540px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <iframe
                  title="Nara Location Map"
                  src={embedMapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "420px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default ContactUs;

