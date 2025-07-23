// src/components/home/TestimonialsSection.jsx

import React from 'react';
// LazyLoadImage and its CSS import are no longer needed if no images are displayed
// import { LazyLoadImage } from "react-lazy-load-image-component";
// import "react-lazy-load-image-component/src/effects/opacity.css";

// Sample Testimonial Data
// Removed 'image' property from each testimonial object
const testimonials = [
  {
    id: 1,
    quote: "NARA's quality is exceptional. Every piece feels luxurious and is so comfortable to wear. I've received countless compliments!",
    name: "Aisha Sharma",
    location: "Mumbai, India",
    rating: 5,
  },
  {
    id: 2,
    quote: "The designs are so chic. Love it!",
    name: "Yashika Verma",
    location: "Bengaluru, India",
    rating: 5,
  },
  {
    id: 3,
    quote: "Absolutely thrilled with my purchase! The fit is perfect, and the fabric feels amazing. Excellent customer service too.",
    name: "Priya Singh",
    location: "Delhi, India",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-white dark:bg-black py-16 px-4 md:px-8 lg:px-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
        What Our Customers Say
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-50 dark:bg-[#1E1E1E] p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Removed the image rendering block entirely */}
            
            {/* Star Rating */}
            <div className="flex justify-center mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <p className="text-gray-700 dark:text-gray-300 italic mb-4">
              "{testimonial.quote}"
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              - {testimonial.name}
            </p>
            {testimonial.location && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {testimonial.location}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;