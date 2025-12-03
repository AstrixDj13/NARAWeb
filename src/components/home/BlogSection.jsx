import React, { useState, useEffect } from "react";
import { blogs } from "../../constants/blogs";

const BlogCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [autoPlay, setAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % blogs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % blogs.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + blogs.length) % blogs.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-12 bg-[#f5f5e1] dark:bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 dark:text-[#D8E3B1]">
          From Our Blog
        </h2>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden rounded-xl shadow-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {blogs.map((blog, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-white dark:bg-[#1F1F1F] p-6 md:p-8">
                    {/* Image Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {blog.images.slice(0, 4).map((src, i) => (
                        <div key={i} className="relative overflow-hidden rounded-lg">
                          <img
                            src={src}
                            alt={`${blog.title} - Image ${i + 1}`}
                            className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-900 leading-tight">
                        {blog.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-600 italic">
                        {blog.metaDescription}
                      </p>

                      <div className="text-gray-700 dark:text-gray-700">
                        <p>{blog.excerpt}</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4">
                        <a
                          href={blog.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-800 dark:bg-green-800 text-white dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-[#C5D49A] transition-colors font-medium inline-block"
                        >
                          Read Full Article
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#1F1F1F] p-1 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors z-10"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-[#1F1F1F] p-1 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors z-10"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-6">
            {blogs.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide
                    ? 'bg-green-800 dark:bg-[#D8E3B1]'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                onMouseEnter={() => setAutoPlay(false)}
                onMouseLeave={() => setAutoPlay(true)}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              {autoPlay ? '⏸️ Pause Auto-play' : '▶️ Resume Auto-play'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;