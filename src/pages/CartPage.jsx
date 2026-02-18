import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NavbarRelative from "../components/Navbar/NavbarRelative";
import CartItem from "../components/Cart/CartItem";
import YouMayAlsoLike from "../components/Cart/YouMayAlsoLike";
import { fixCheckoutUrl } from "../utils/interceptors";
import { updateBuyersIndentity } from "../apis/Cart";
import getAccountDetailsAPI from "../apis/getAccoutDetailsAPI";
import { Skeleton } from "@mui/material";
import { HiArrowNarrowLeft } from "react-icons/hi";
import TrustBadges from "../components/productsDetail/TrustBadges";
import Coupons from "../components/Cart/Coupons";

export default function CartPage() {
    const totalQuantityInCart = useSelector((state) => state.cart.totalQuantity);
    const checkoutUrl = useSelector((state) => state.cart.checkoutUrl);
    const cartId = useSelector((state) => state.cart.id);
    const productsInCart = useSelector((state) => state.cart.productsInCart);
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const accessToken = useSelector((state) => state.user.accessToken);
    const [cartLoading, setCartLoading] = useState(false); // You might want to handle loading state from redux if available

    const checkOutHandler = async () => {
        const fixedUrl = fixCheckoutUrl(checkoutUrl);
        if (!fixedUrl) {
            toast.error("Unable to proceed to checkout. Please try again.");
            return;
        }
        if (totalQuantityInCart === 0) return toast.error("Your cart is empty!");

        // Enhance buyer identity if authenticated
        if (isAuthenticated && accessToken) {
            try {
                const customerDetails = await getAccountDetailsAPI();
                if (customerDetails && customerDetails.defaultAddress) {
                    const address = customerDetails.defaultAddress;
                    const deliveryAddress = {
                        address1: address.address1,
                        address2: address.address2,
                        city: address.city,
                        country: "IN", // Assuming IN based on other code
                        firstName: address.firstName,
                        lastName: address.lastName,
                        province: address.province,
                        zip: address.zip
                    };

                    await updateBuyersIndentity(cartId, customerDetails.email, deliveryAddress, customerDetails.phone);
                    console.log("Buyer identity updated successfully");
                }
            } catch (err) {
                console.error("Failed to update buyer identity:", err);
                // Continue to checkout even if this fails
            }
        }

        window.location.href = fixedUrl;
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
        if (!productsInCart || productsInCart.length === 0) return 0;
        return productsInCart.reduce((total, item) => {
            const price = parseFloat(item?.node?.merchandise?.price?.amount || 0);
            const quantity = item?.node?.quantity || 0;
            return total + (price * quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const DELIVERY_FEE = 100;
    const savings = (subtotal * 0.15) + DELIVERY_FEE; // 15% Loss Aversion Savings + Waived Delivery Fee

    return (
        <div className="flex flex-col min-h-screen bg-[#F7F7F7] dark:bg-black dark:text-white font-antikor">
            <NavbarRelative />

            <div className="flex flex-col items-center justify-center flex-grow p-4 mt-[74px]">
                <div className="w-full max-w-4xl bg-white dark:!bg-black dark:border dark:border-gray-800 shadow-md rounded-lg p-6">
                    <div className="flex items-center justify-between border-b pb-4 mb-4 dark:border-gray-800">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white">YOUR CART</h1>
                        <span className="text-gray-900 dark:text-white">{totalQuantityInCart} Items</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {productsInCart && productsInCart.length > 0 ? (
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left Column: Cart Items */}
                                <div className="flex flex-col gap-6 md:w-3/5 h-full">
                                    {productsInCart.map((el) => (
                                        <CartItem
                                            key={el?.node?.id}
                                            cartLineId={el?.node?.id}
                                            cartId={cartId}
                                            src={el?.node?.merchandise?.image?.src}
                                            quantity={el?.node?.quantity}
                                            title={el?.node?.merchandise?.product?.title}
                                            pricePerItem={el?.node?.merchandise?.price}
                                            productId={el?.node?.merchandise?.id}
                                            size={
                                                el?.node?.merchandise?.selectedOptions?.find(
                                                    (el) => el?.name === "Size"
                                                )?.value
                                            }
                                            stockLeft={el?.node?.merchandise?.product?.metafield?.value}
                                            className="min-h-[160px] flex-1"
                                        />
                                    ))}
                                </div>

                                {/* Right Column: Summary & Trust Badges */}
                                <div className="md:w-2/5 flex flex-col gap-6">
                                    {/* Loss Aversion & Subtotal Section */}
                                    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col gap-4 h-fit sticky top-24">
                                        {/* Delivery Fee Display */}
                                        <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
                                            <span className="font-semibold text-lg text-green-600 dark:text-green-400">Delivery</span>
                                            <div className="flex items-center gap-[5px]">
                                                <span className="font-semibold text-lg text-green-600 dark:text-green-400">FREE</span>
                                                <span className="line-through text-red-500">₹{DELIVERY_FEE}</span>
                                            </div>
                                        </div>

                                        {/* Savings Display */}
                                        <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                                            <span className="font-bold text-lg">You Saved:</span>
                                            <span className="font-bold text-xl">₹{savings.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-[-10px] text-right">
                                            (Total savings on this order!)
                                        </p>
                                        <hr className="border-gray-300 dark:border-gray-700" />

                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-xl">Subtotal:</span>
                                            <span className="font-black text-2xl text-[#1F4A40] dark:text-white">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                            Taxes and shipping calculated at checkout
                                        </p>

                                        <div className="flex flex-col gap-4 mt-4">
                                            {/* <button
                                                onClick={checkOutHandler}
                                                className="w-full bg-[#1F4A40] text-white px-6 py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1"
                                                disabled={totalQuantityInCart === 0}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span>Checkout Now</span>
                                                    <div className="flex items-center gap-1">
                                                        <img src="/icons/upi.png" alt="UPI" className="h-5 w-auto object-contain bg-white rounded-sm px-[2px]" />
                                                        <img src="/icons/visa.png" alt="Visa" className="h-5 w-auto object-contain bg-white rounded-sm px-[2px]" />
                                                        <img src="/icons/mastercard.webp" alt="MasterCard" className="h-5 w-auto object-contain bg-white rounded-sm px-[2px]" />
                                                        <span className="text-xs bg-white text-black font-bold px-1 rounded-sm">+18</span>
                                                    </div>
                                                </div>
                                            </button> */}

                                            <button
                                                onClick={checkOutHandler}
                                                className="w-full bg-[#1F4A40] text-white px-6 py-3 font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-[2px]"
                                                disabled={totalQuantityInCart === 0}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <span>Checkout</span>

                                                    <div className="flex items-center gap-[3px]">
                                                        <img src="/icons/upi.png" alt="UPI" className="h-4 w-auto object-contain bg-white rounded px-[1px]" />
                                                        <img src="/icons/phonepe.jpg" alt="PhonePe" className="h-4 w-auto object-contain bg-white rounded px-[1px]" />
                                                        <img src="/icons/gpay.webp" alt="GPay" className="h-4 w-auto object-contain bg-white rounded px-[1px]" />
                                                        <span className="text-[10px] bg-white text-black font-bold px-[3px] rounded">+18</span>
                                                    </div>
                                                </div>
                                            </button>

                                            <Link
                                                to="/products"
                                                className="w-full flex items-center justify-center gap-2 border-2 border-[#1F4A40] text-[#1F4A40] dark:border-white dark:text-white px-6 py-3 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                <HiArrowNarrowLeft /> Continue Shopping
                                            </Link>
                                        </div>
                                        <TrustBadges />
                                    </div>


                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 py-12">
                                <p className="text-xl text-gray-500">Your cart is currently empty.</p>
                                <Link
                                    to="/products"
                                    className="bg-[#1F4A40] text-white px-6 py-3 font-bold hover:opacity-90 transition-opacity"
                                >
                                    Start Shopping
                                </Link>
                                <TrustBadges />
                            </div>
                        )}
                        <Coupons />
                        <YouMayAlsoLike />
                    </div>
                </div>
            </div>
        </div >
    );
}
