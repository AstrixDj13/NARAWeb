import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919326472754"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-50 text-[#25D366] drop-shadow-md hover:scale-110 hover:drop-shadow-lg transition-all duration-300 flex items-center justify-center"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp className="text-5xl md:text-6xl" />
    </a>
  );
}
