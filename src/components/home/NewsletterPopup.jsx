import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MuiTelInput } from "mui-tel-input";

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
            const response = await fetch("http://localhost:3001/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, phone }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Successfully subscribed!");
                handleClose();
            } else {
                toast.error(data.error || "Failed to subscribe");
            }
        } catch (error) {
            console.error("Newsletter error:", error);
            toast.error("Something went wrong. Please try again.");
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 500 }}
                        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
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

                        <div className="p-8">
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-antikor">
                                    Join the Club
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Subscribe to get special offers, free giveaways, and
                                    once-in-a-lifetime deals.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                    >
                                        Phone Number
                                    </label>
                                    <MuiTelInput
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        defaultCountry="IN"
                                        className="w-full bg-white dark:bg-zinc-800 rounded-lg"
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
                                                color: "inherit",
                                            },
                                            // Dark mode adjustments if needed, though MUI handles some automatically
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                >
                                    {loading ? "Subscribing..." : "Subscribe"}
                                </button>
                            </form>

                            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
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
