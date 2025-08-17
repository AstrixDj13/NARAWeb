import React, { useState, useEffect } from "react";

const blogs = [
  {
    title: "The New-Age Twist on Indian Heritage Prints",
    metaDescription: "Heritage prints are back, but not how you remember them. See how NARA transforms Ajrak, Ikat, and Chikankari into pure cotton everyday outfits for Gen Z and millennials.",
    excerpt: "Heritage prints have been part of our wardrobes for generations. They're the fabrics of family weddings, festival mornings, and the special outfit your grandmother wore with pride. But somewhere along the way, they got boxed into 'too traditional' territory.",
    content: `Heritage prints have been part of our wardrobes for generations. They're the fabrics of family weddings, festival mornings, and the special outfit your grandmother wore with pride. But somewhere along the way, they got boxed into "too traditional" territory.

At NARA, we're here to change that. We've taken the rich textures of Ikat, Ajrak, and Chikankari and spun them into modern silhouettes you can wear to brunch, to work, or on a lazy Sunday. Think breathable pure cotton, fuss-free tailoring, and styles that make you feel like you, only better.

**Style It Your Way:**
• Pair a heritage print shirt with wide-leg jeans for a street-style twist.
• Wear your Ajrak skirt with sneakers (because comfort > rules).
• Layer a chikankari kurta over trousers for a work-friendly fit.`,
    images: [
      "/blog1/blog1_1.jpeg",
      "/blog1/blog1_2.jpeg",
      "/blog1/blog1_3.jpeg",
      "/blog1/blog1_4.JPG"
    ],
    cta: "Heritage belongs in your everyday life. Shop the collection here.",
    link: "/blog/heritage-prints"
  },
  {
    title: "Festive Dressing 2025 – The Trends You'll Actually Wear",
    metaDescription: "From sparkly georgettes to cotton chikankari, here's how to nail festive 2025 dressing without looking like everyone else.",
    excerpt: "Festive season is creeping up and while Pinterest boards are full of OTT lehengas and one-time-wear outfits, we're here to talk about looks you'll actually re-wear.",
    content: `Festive season is creeping up and while Pinterest boards are full of OTT lehengas and one-time-wear outfits, we're here to talk about looks you'll actually re-wear.

Here's what's hot this year:

**1. Red, but Make it Deeper**
The statement shade of the season is a rich, deep red, regal enough for the poojas, bold enough for a cocktail night.

**2. Sheer Layers & Sparkle Play**
Layer georgettes over sequin bases for that "glow from within" effect, yes, it's a thing now.

**3. Chikankari Goes Minimal Luxe**
White and pastel chikankari pieces aren't just for day events anymore. Pair with bold jewellery or smokey eyes for a night switch-up.

**4. Menswear Makes a Statement**
Black chikankari kurtas and structured cuts are redefining men's festive dressing, minimal yet powerful.

**5. Modern Backdrops for Traditional Fits**
The new aesthetic is all about contrast, think temple earrings with sneakers, or a silk kurta in an industrial cafe setting.

**Founder's Tip:**
"If you can wear it for Diwali and a random Sunday brunch, it's worth investing in." – Ishika, Founder of NARA`,
    images: [
      "/blog2/blog2_1.jpeg",
      "/blog2/blog2_2.jpeg",
      "/blog2/blog2_3.jpeg",
      "/blog2/blog2_4.JPG"
    ],
    cta: "Our take on these trends is coming very soon. Get ready to shop for pieces that look traditional, feel comfortable, and photograph like a dream.",
    link: "/blog/festive-trends-2025"
  },
  {
    title: "The Story Behind 'Chaon: The Summer Edit'",
    metaDescription: "Inspired by the contrast of heat and shade, Chaon: The Summer Edit is NARA's take on breathable, vibrant summer dressing with block prints and ikat.",
    excerpt: "Summer in India isn't just a season, it's a test of endurance. The kind where you step outside and instantly start daydreaming about a glass of nimbu paani under a shady tree.",
    content: `Summer in India isn't just a season, it's a test of endurance. The kind where you step outside and instantly start daydreaming about a glass of nimbu paani under a shady tree.

Chaon was born from that feeling, the sweet relief of finding shade in the middle of relentless heat. We turned that moment into breathable silhouettes in pure cotton, block prints, and ikat patterns. The colours? Soft pastels for calm, bright tones for energy, a balance of shade and sunshine.

**From Fabric to Final Outfit:**
• Step 1: Sourcing breathable cottons from trusted heritage textile artisans.
• Step 2: Crafting silhouettes that are flattering and practical.
• Step 3: Shooting the collection in settings that capture the essence of Indian summer.`,
    images: [
      "/blog3/blog3_1.jpg",
      "/blog3/blog3_2.jpg",
      "/blog3/blog3_3.jpeg",
      "/blog3/blog3_4.jpeg"
    ],
    cta: "Find your summer shade. Shop Chaon now.",
    link: "/blog/chaon-summer-edit"
  }
];

const BlogCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [expandedBlog, setExpandedBlog] = useState(null);
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

  const toggleExpanded = (index) => {
    setExpandedBlog(expandedBlog === index ? null : index);
    setAutoPlay(false); // Pause auto-play when reading
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h4 key={index} className="font-semibold text-gray-900 dark:text-gray-900 mt-4 mb-2">
            {paragraph.slice(2, -2)}
          </h4>
        );
      } else if (paragraph.startsWith('•')) {
        return (
          <li key={index} className="ml-4 text-gray-700 dark:text-gray-700 mb-1">
            {paragraph.slice(2)}
          </li>
        );
      } else if (paragraph.trim()) {
        return (
          <p key={index} className="text-gray-700 dark:text-gray-700 mb-3">
            {paragraph}
          </p>
        );
      }
      return null;
    });
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
                        {expandedBlog === index ? (
                          <div className="space-y-2">
                            {formatContent(blog.content)}
                            <div className="bg-green-50 dark:bg-green-50 p-4 rounded-lg mt-6">
                              <p className="text-green-800 dark:text-green-800 font-medium">
                                {blog.cta}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p>{blog.excerpt}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4">
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="px-4 py-2 bg-green-800 dark:bg-green-800 text-white dark:text-white rounded-lg hover:bg-green-700 dark:hover:bg-[#C5D49A] transition-colors font-medium"
                        >
                          {expandedBlog === index ? 'Show Less' : 'Read Full Article'}
                        </button>
                        {/*<a
                          href={blog.link}
                          className="px-4 py-2 border-2 border-green-800 dark:border-[#D8E3B1] text-green-800 dark:text-[#D8E3B1] rounded-lg hover:bg-green-800 hover:text-white dark:hover:bg-[#D8E3B1] dark:hover:text-black transition-colors font-medium"
                        >
                          View on Site →
                        </a>*/}
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
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
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