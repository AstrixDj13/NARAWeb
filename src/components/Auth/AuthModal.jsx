import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { MuiTelInput } from "mui-tel-input";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import LoginApi from "../../apis/LoginApi";
import SignupApi from "../../apis/SignupApi";
import { SendRecoveryEmailAPI } from "../../apis/CustomerAPI";
import {
    setAuthStatus,
    deleteCart,
} from "../../store";
import logo from "../../assets/NaraLogo.png";

const AuthModal = ({ isOpen, onClose }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const dispatch = useDispatch();

    // Login State
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    // Signup State
    const [signupName, setSignupName] = useState("");
    const [signupPhone, setSignupPhone] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [isSignupLoading, setIsSignupLoading] = useState(false);
    const [actualPhone, setActualPhone] = useState("");

    // Reset states when modal closes or view switches
    useEffect(() => {
        if (!isOpen) {
            // Optional: reset forms on close
        }
    }, [isOpen]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        try {
            const accessToken = await LoginApi({ email: loginEmail, password: loginPassword });
            toast.success("Login successful!");
            dispatch(setAuthStatus({ accessToken, isAuthenticated: true }));
            dispatch(deleteCart());
            localStorage.removeItem("cartId");
            onClose();
        } catch (error) {
            if (error.message.includes("Unidentified customer")) {
                toast.error("Either the email or the password is incorrect!");
            } else {
                toast.error("Login failed: " + error.message);
            }
        } finally {
            setIsLoginLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateSignupForm()) {
            toast.error("Please fill all fields correctly.");
            return;
        }
        setIsSignupLoading(true);
        try {
            await SignupApi({
                name: signupName,
                phone: signupPhone,
                email: signupEmail,
                password: signupPassword,
            });
            toast.success("Signup successful! Please login.");
            setIsLoginView(true);
        } catch (error) {
            toast.error("Signup failed: " + error.message);
        } finally {
            setIsSignupLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!loginEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) {
            toast.error("Please enter a valid email address first!");
            return;
        }
        try {
            const response = await SendRecoveryEmailAPI(loginEmail);
            if (response) {
                toast.success("Recovery email sent.");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Validation Helpers
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
    const validatePassword = (password) => password.length >= 5;
    const validateName = (name) => name.trim().length > 3;
    const validatePhone = (phone) => phone.length === 10;

    const validateSignupForm = () => {
        return (
            validateName(signupName) &&
            validatePhone(actualPhone) &&
            validateEmail(signupEmail) &&
            validatePassword(signupPassword)
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[5000001] bg-black/40 flex justify-center items-center"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-black dark:text-white w-full max-w-md p-8 rounded-lg shadow-xl relative mx-4 max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-black dark:hover:text-white"
                        >
                            &times;
                        </button>

                        <div className="text-center mb-6">
                            <p className="font-extrabold text-xl mb-1 text-black dark:text-black">Welcome to</p>
                            <div className="flex justify-center mb-3">
                                <img
                                    src={logo}
                                    alt="NARA logo"
                                    className="w-[150px] lg:w-[200px]"
                                />
                            </div>
                            {isLoginView ? (
                                <div className="mt-2">
                                    <p className="text-sm italic text-gray-700 dark:text-gray-700 mb-1">
                                        Every day is a chance to reinvent your style.
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">
                                        Log in to access your orders, wishlist, and exclusive perks.
                                    </p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-600 dark:text-gray-600 mt-2">
                                    Enter your details to get started.
                                </p>
                            )}
                        </div>

                        {isLoginView ? (
                            // Login Form
                            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded focus:outline-none focus:border-[#1F4A40]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-600 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showLoginPassword ? "text" : "password"}
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded focus:outline-none focus:border-[#1F4A40]"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-gray-500"
                                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        >
                                            {showLoginPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-sm text-[#1F4A40] dark:text-[#1F4A40] hover:underline"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoginLoading}
                                    className="w-full bg-[#1F4A40] text-white py-2 rounded font-semibold hover:bg-[#16352e] transition-colors disabled:opacity-70"
                                >
                                    {isLoginLoading ? "Signing In..." : "Sign In"}
                                </button>
                            </form>
                        ) : (
                            // Signup Form
                            <form onSubmit={handleSignup} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-600 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={signupName}
                                        onChange={(e) => setSignupName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded focus:outline-none focus:border-[#1F4A40]"
                                        required
                                    />
                                    {signupName && !validateName(signupName) && (
                                        <p className="text-xs text-red-500 mt-1">Name must be {'>'} 3 chars</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-600 mb-1">Phone</label>
                                    <MuiTelInput
                                        value={signupPhone}
                                        onChange={(val, info) => {
                                            setSignupPhone(val);
                                            setActualPhone(info.nationalNumber);
                                        }}
                                        defaultCountry="IN"
                                        className="w-full bg-gray-50 dark:bg-gray-800 border-gray-300"
                                        size="small"
                                    />
                                    {actualPhone && !validatePhone(actualPhone) && (
                                        <p className="text-xs text-red-500 mt-1">Must be 10 digits</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={signupEmail}
                                        onChange={(e) => setSignupEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded focus:outline-none focus:border-[#1F4A40]"
                                        required
                                    />
                                    {signupEmail && !validateEmail(signupEmail) && (
                                        <p className="text-xs text-red-500 mt-1">Invalid email</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-600 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showSignupPassword ? "text" : "password"}
                                            value={signupPassword}
                                            onChange={(e) => setSignupPassword(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded focus:outline-none focus:border-[#1F4A40]"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-2.5 text-gray-500"
                                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                                        >
                                            {showSignupPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                        </button>
                                    </div>
                                    {signupPassword && !validatePassword(signupPassword) && (
                                        <p className="text-xs text-red-500 mt-1">Must be at least 5 chars</p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSignupLoading || !validateSignupForm()}
                                    className="w-full bg-[#1F4A40] text-white py-2 rounded font-semibold hover:bg-[#16352e] transition-colors disabled:opacity-70 disabled:bg-gray-400"
                                >
                                    {isSignupLoading ? "Creating Account..." : "Sign Up"}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center text-sm">
                            <p className="text-gray-600 dark:text-gray-600">
                                {isLoginView ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => setIsLoginView(!isLoginView)}
                                    className="text-[#1F4A40] dark:text-[#1F4A40] font-bold hover:underline"
                                >
                                    {isLoginView ? "Sign Up" : "Log In"}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
