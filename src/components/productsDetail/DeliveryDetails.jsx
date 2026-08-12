import { useState } from "react";

export default function DeliveryDetails() {
    const [pincode, setPincode] = useState("");
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleCheck = async () => {
        if (!/^[1-9][0-9]{5}$/.test(pincode)) {
            setStatus("error");
            setMessage("Please enter a valid 6-digit Pincode.");
            return;
        }

        setIsLoading(true);
        setStatus(null);
        setMessage("");

        try {
            const response = await fetch(`/api/delhivery/pincode?pincode=${pincode}`);
            const data = await response.json();

            if (data.success && data.is_serviceable) {
                setStatus("success");
                const deliveryDate = new Date();
                deliveryDate.setDate(deliveryDate.getDate() + (data.expected_delivery || 4));
                const options = { weekday: 'short', month: 'short', day: 'numeric' };
                const destination = data.city ? data.city : "your area";
                setMessage(`Delivery available to ${destination}! Expected by ${deliveryDate.toLocaleDateString('en-IN', options)}.`);
            } else {
                setStatus("error");
                setMessage("Sorry, delivery is not available for this pincode.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to check pincode. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const ReturnIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 flex-shrink-0 text-gray-600 dark:text-gray-400">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <div className="mt-4 flex flex-col gap-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 font-outfit">Delivery Details</h3>

            <div className="relative w-full">
                <input
                    type="text"
                    value={pincode}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setPincode(val);
                        if (status) { setStatus(null); setMessage(""); }
                    }}
                    maxLength={6}
                    placeholder="Enter Pincode"
                    className={`w-full border rounded-md py-3 px-4 outline-none font-outfit dark:bg-black dark:text-white text-gray-700 placeholder-gray-400 ${status === 'error' ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-700 focus:border-teal-600'}`}
                />
                <button
                    onClick={handleCheck}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-teal-600 dark:text-teal-500 tracking-wider text-sm hover:text-teal-700 transition-colors disabled:opacity-50"
                >
                    {isLoading ? "CHECKING..." : "CHECK"}
                </button>
            </div>

            {status === "error" && (
                <p className="text-red-500 text-sm font-outfit -mt-2">{message}</p>
            )}
            {status === "success" && (
                <p className="text-teal-600 dark:text-teal-400 font-semibold text-sm font-outfit -mt-2">{message}</p>
            )}

            <div className="flex items-start gap-4 p-4 mt-2 border border-gray-300 dark:border-gray-700 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 flex-shrink-0 text-gray-900 dark:text-gray-100">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M10 10h4v4h-4z" />
                </svg>
                <p className="text-sm text-gray-900 dark:text-gray-100 font-outfit">
                    This product is eligible for exchange under our 10 days Exchange Policy. No questions asked.
                </p>
            </div>
        </div>
    );
}
