import React, { useState } from 'react';
import { toast } from 'sonner';
import Navbar from "../components/Navbar/NavbarUpdated";
import FooterSection from "../components/home/FooterSectionUpdated";

const UGCCollaboration = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        socialHandle: '',
        followers: '',
        ugcLink: '',
        brandsWorkedWith: '',
        contentIdeas: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/ugc-collaboration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Thanks for your interest! We'll be in touch soon.");
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    socialHandle: '',
                    followers: '',
                    ugcLink: '',
                    brandsWorkedWith: '',
                    contentIdeas: ''
                });
            } else {
                toast.error(data.error || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit form. Please check your connection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-antikor">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-4 uppercase tracking-wider">
                            Create. Collaborate. Get Featured.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-900 font-medium mb-2">
                            Your Content. Our Brand.
                        </p>
                        <p className="text-lg text-[#1F4A40] font-bold uppercase tracking-wide">
                            Turn Your Content Into Collaboration
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#1C1C1C] p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white"
                                        placeholder="Your full name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                        Email ID
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label htmlFor="city" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white"
                                        placeholder="Current city"
                                    />
                                </div>
                            </div>

                            {/* Social Media Handles */}
                            <div>
                                <label htmlFor="socialHandle" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Social Media Handles (Insta, FB or Any)
                                </label>
                                <input
                                    type="text"
                                    id="socialHandle"
                                    name="socialHandle"
                                    required
                                    value={formData.socialHandle}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white"
                                    placeholder="@username"
                                />
                            </div>

                            {/* Number of Followers */}
                            <div>
                                <label htmlFor="followers" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Number of Followers
                                </label>
                                <input
                                    type="text"
                                    id="followers"
                                    name="followers"
                                    required
                                    value={formData.followers}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white"
                                    placeholder="e.g. 10k, 5000"
                                />
                            </div>

                            {/* Link to UGC Content */}
                            <div>
                                <label htmlFor="ugcLink" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Link to UGC Content You Created for Any Other Brand
                                </label>
                                <input
                                    type="url"
                                    id="ugcLink"
                                    name="ugcLink"
                                    value={formData.ugcLink}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Brands Worked With */}
                            <div>
                                <label htmlFor="brandsWorkedWith" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    Brands You Have Worked With
                                </label>
                                <textarea
                                    id="brandsWorkedWith"
                                    name="brandsWorkedWith"
                                    rows="3"
                                    value={formData.brandsWorkedWith}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white resize-none"
                                    placeholder="List brands..."
                                ></textarea>
                            </div>

                            {/* UGC Content Ideas */}
                            <div>
                                <label htmlFor="contentIdeas" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">
                                    UGC Content Ideas for NARA
                                </label>
                                <textarea
                                    id="contentIdeas"
                                    name="contentIdeas"
                                    required
                                    rows="4"
                                    value={formData.contentIdeas}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#1F4A40] focus:border-transparent outline-none transition-all bg-white dark:bg-black text-black dark:text-white resize-none"
                                    placeholder="Share your creative ideas..."
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#1F4A40] hover:bg-[#16332b] text-white font-bold py-4 rounded-lg uppercase tracking-widest transition-all transform hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-xl"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default UGCCollaboration;
