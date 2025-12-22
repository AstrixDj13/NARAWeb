import React from "react";

const TrustBadges = () => {
    const badges = [
        {
            icon: (
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z" fill="#1E7B74" fillOpacity="0.15" />
                    <path d="M12 2L4 6V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V6L12 2Z" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12L11 14L15 10" stroke="#1E7B74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Razorpay Trusted",
            description: "100% secure payments",
        },
        {
            icon: (
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H8C8.53043 5 9.03914 5.21071 9.41421 5.58579C9.78929 5.96086 10 6.46957 10 7V9C10 9.53043 9.78929 10.0391 9.41421 10.4142C9.03914 10.7893 8.53043 11 8 11H6C5.46957 11 4.96086 10.7893 4.58579 10.4142C4.21071 10.0391 4 9.53043 4 9V7Z" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 7C14 6.46957 14.2107 5.96086 14.5858 5.58579C14.9609 5.21071 15.4696 5 16 5H18C18.5304 5 19.0391 5.21071 19.4142 5.58579C19.7893 5.96086 20 6.46957 20 7V9C20 9.53043 19.7893 10.0391 19.4142 10.4142C19.0391 10.7893 18.5304 11 18 11H16C15.4696 11 14.9609 10.7893 14.5858 10.4142C14.2107 10.0391 14 9.53043 14 9V7Z" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M4 15C4 14.4696 4.21071 13.9609 4.58579 13.5858C4.96086 13.2107 5.46957 13 6 13H8C8.53043 13 9.03914 13.2107 9.41421 13.5858C9.78929 13.9609 10 14.4696 10 15V17C10 17.5304 9.78929 18.0391 9.41421 18.4142C9.03914 18.7893 8.53043 19 8 19H6C5.46957 19 4.96086 18.7893 4.58579 18.4142C4.21071 18.0391 4 17.5304 4 17V15Z" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 15C14 14.4696 14.2107 13.9609 14.5858 13.5858C14.9609 13.2107 15.4696 13 16 13H18C18.5304 13 19.0391 13.2107 19.4142 13.5858C19.7893 13.9609 20 14.4696 20 15V17C20 17.5304 19.7893 18.0391 19.4142 18.4142C19.0391 18.7893 18.5304 19 18 19H16C15.4696 19 14.9609 18.7893 14.5858 18.4142C14.2107 18.0391 14 17.5304 14 17V15Z" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 8L17 16M17 8L7 16" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Easy Exchange",
            description: "No hassle returns",
        },
        {
            icon: (
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 3L6 6M21 3L18 6M12 7V12" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 2H16M8 22H16" stroke="#1E7B74" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ),
            title: "Express Shipping",
            description: "Dispatch in 24 hrs",
        },
    ];

    return (
        <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {badges.map((badge, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center text-center gap-2"
                    >
                        <div className="mb-1">
                            {badge.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-base mb-1">{badge.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {badge.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrustBadges;