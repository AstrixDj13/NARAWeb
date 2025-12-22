import React from "react";

const TrustBadges = () => {
    const badges = [
        {
            image: "/trust_badges/secure_payment.png",
            title: "Razorpay Trusted",
            description: "100% secure payments",
        },
        {
            image: "/trust_badges/easy_exchange.png",
            title: "Easy Exchange",
            description: "Hassle-free returns",
        },
        {
            image: "/trust_badges/express_shipping.png",
            title: "Express Shipping",
            description: "Dispatch within 24 hours",
        },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-12 py-8 w-full">
            {badges.map((badge, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center text-center min-w-[160px]"
                >
                    {/* Icon/Image */}
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                        <img
                            src={badge.image}
                            alt={badge.title}
                            className="w-full h-full object-contain drop-shadow-md"
                        />
                    </div>

                    {/* Text */}
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
                        {badge.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                        {badge.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default TrustBadges;
