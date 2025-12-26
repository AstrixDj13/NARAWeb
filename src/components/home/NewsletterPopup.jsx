import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MuiTelInput } from "mui-tel-input";
import backendApi from "../../utils/backendApi";

const NewsletterPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem("hasSeenNewsletterPopup");
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
                sessionStorage.setItem("hasSeenNewsletterPopup", "true");
            }, 5000); // Show after 5 seconds
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem("hasSeenNewsletterPopup", "true");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email && !phone) {
            toast.error("Please enter either email or phone number");
            return;
        }

        setLoading(true);
        try {
            const response = await backendApi.post("/api/newsletter", { email, phone });
            const data = response.data;

            if (response.status === 200) {
                toast.success(data.message || "Successfully subscribed!");
                handleClose();
            } else {
                toast.error(data.error || "Failed to subscribe");
            }
        } catch (error) {
            console.error("Newsletter error:", error);
            toast.error(error.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneChange = (newValue) => {
        setPhone(newValue);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 500 }}
                        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden mt-20"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <div className="p-6">
                            <div className="text-center mb-3">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-antikor">
                                    Be Part of the NARA Circle
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Style inspiration, early access, surprises, and little treats, straight to you.
                                </p>
                                <p className="text-[12px] text-black mt-2">
                                    We respect your privacy. No spam,only value.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent bg-white text-gray-900 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-xs font-medium text-gray-700 mb-1"
                                    >
                                        Phone Number
                                    </label>
                                    <MuiTelInput
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        defaultCountry="IN"
                                        className="w-full bg-white rounded-lg"
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "#d1d5db", // gray-300
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#9ca3af", // gray-400
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "black",
                                                },
                                            },
                                            "& .MuiInputBase-input": {
                                                color: "#111827", // gray-900
                                            },
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white font-bold py-2.5 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-sm"
                                >
                                    {loading ? "Subscribing..." : "Subscribe"}
                                </button>
                            </form>

                            <p className="mt-3 text-[10px] text-center text-gray-500">
                                By subscribing you agree to our Terms & Conditions and Privacy
                                Policy.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NewsletterPopup;
