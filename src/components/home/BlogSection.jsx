import React from "react";

const blogs = [
  {
    title: "The New-Age Twist on Indian Heritage Prints",
    description:
      "Heritage prints like Ajrak, Ikat, and Chikankari reimagined in breathable pure cotton silhouettes for Gen Z and millennials.",
    images: [
      "/blog1/blog1_1.jpeg",
      "/blog1/blog1_2.jpeg",
      "/blog1/blog1_3.jpeg"
    ],
    link: "/blog/heritage-prints"
  },
  {
    title: "Festive Dressing 2025 – The Trends You’ll Actually Wear",
    description:
      "From deep reds to minimal luxe chikankari, discover festive looks you'll rewear beyond the celebrations.",
    images: [
      "/blog2/blog2_1.jpeg",
      "/blog2/blog2_2.jpeg",
      "/blog2/blog2_3.jpeg"
    ],
    link: "/blog/festive-trends-2025"
  },
  {
    title: "The Story Behind ‘Chaon: The Summer Edit’",
    description:
      "Inspired by shade in the summer heat, Chaon blends breathable cotton, block prints, and ikat for perfect seasonal balance.",
    images: [
      "/blog3/blog3_1.jpg",
      "/blog3/blog3_2.jpg",
      "/blog3/blog3_3.jpeg",
      "/blog3/blog3_4.jpeg"
    ],
    link: "/blog/chaon-summer-edit"
  }
];

const BlogSection = () => {
  return (
    <section className="py-12 bg-[#f5f5e1] dark:bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 dark:text-[#D8E3B1]">
          From Our Blog
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1F1F1F] rounded-xl overflow-hidden shadow-md flex flex-col"
            >
              <div className="grid grid-cols-2 gap-1">
                {blog.images.slice(0, 4).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={blog.title}
                    className="w-full h-32 object-cover"
                  />
                ))}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                  {blog.description}
                </p>
                <a
                  href={blog.link}
                  className="mt-4 inline-block text-green-800 dark:text-[#D8E3B1] font-medium hover:underline"
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;