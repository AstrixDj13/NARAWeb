import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogs } from "../constants/blogs";

const BlogPost = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const blog = blogs.find((b) => b.slug === slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5e1] dark:bg-black text-center px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Blog Post Not Found
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    The article you are looking for does not exist.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-green-800 dark:bg-green-800 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const formatContent = (content) => {
        return content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                    <h4 key={index} className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-6 mb-3">
                        {paragraph.slice(2, -2)}
                    </h4>
                );
            } else if (paragraph.startsWith('•')) {
                return (
                    <li key={index} className="ml-4 text-gray-700 dark:text-gray-300 mb-2 list-disc">
                        {paragraph.slice(2)}
                    </li>
                );
            } else if (paragraph.trim()) {
                return (
                    <p key={index} className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {paragraph}
                    </p>
                );
            }
            return null;
        });
    };

    return (
        <div className="min-h-screen bg-[#f5f5e1] dark:bg-black pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <button
                    onClick={() => navigate("/")}
                    className="mb-8 text-green-800 dark:text-[#D8E3B1] hover:underline flex items-center gap-2 font-medium"
                >
                    ← Back to Home
                </button>

                <article className="bg-white dark:bg-[#1F1F1F] rounded-xl shadow-lg overflow-hidden">
                    {/* Header Image */}
                    <div className="h-64 md:h-96 w-full relative">
                        <img
                            src={blog.images[0]}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                            <div className="p-6 md:p-10 w-full">
                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                                    {blog.title}
                                </h1>
                                <p className="text-gray-200 text-lg italic">
                                    {blog.metaDescription}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-10">
                        <div className="prose dark:prose-invert max-w-none">
                            {formatContent(blog.content)}
                        </div>

                        {/* Image Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 mb-10">
                            {blog.images.slice(1).map((src, index) => (
                                <div key={index} className="rounded-lg overflow-hidden h-64">
                                    <img
                                        src={src}
                                        alt={`${blog.title} - ${index + 2}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-900/30 text-center">
                            <p className="text-xl text-green-800 dark:text-[#D8E3B1] font-medium mb-4">
                                {blog.cta}
                            </p>
                            <button
                                onClick={() => navigate("/products")}
                                className="px-8 py-3 bg-green-800 dark:bg-[#D8E3B1] text-white dark:text-black rounded-lg hover:bg-green-700 dark:hover:bg-[#C5D49A] transition-colors font-bold"
                            >
                                Shop Now
                            </button>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogPost;
