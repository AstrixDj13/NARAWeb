import React, { useState, useEffect } from 'react';

// Define your campaigns here - add as many as you need
const campaigns = [
    {
        name: "X-Mas Sale (Flat 25% off)",
        targetDate: "2025-12-13T12:00:00",
    },
    {
        name: "Stock Clearance:B1G1 Free",
        targetDate: "2025-12-15T00:00:00",
    },
];

const CampaignCountdown = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState({});
    const [isSliding, setIsSliding] = useState(false);

    const currentCampaign = campaigns[currentIndex];

    function calculateTimeLeft(targetDate) {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        return timeLeft;
    }

    // Update countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(currentCampaign.targetDate));
        }, 1000);

        // Initial calculation
        setTimeLeft(calculateTimeLeft(currentCampaign.targetDate));

        return () => clearInterval(timer);
    }, [currentCampaign.targetDate]);

    // Auto-slide every 10 seconds
    useEffect(() => {
        const slideTimer = setInterval(() => {
            setIsSliding(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % campaigns.length);
                setIsSliding(false);
            }, 300); // Transition duration
        }, 10000); // 10 seconds

        return () => clearInterval(slideTimer);
    }, []);

    return (
        <div className="relative overflow-hidden w-full">
            <div
                className={`flex flex-col items-center justify-center font-mono text-yellow-400 transition-all duration-300 ${isSliding ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
                    }`}
            >
                <div className="text-xs font-bold uppercase tracking-widest mb-1">
                    {currentCampaign.name}
                </div>
                <div className="flex gap-2 text-sm font-medium">
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.days || 0).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase">Days</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.hours || 0).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase">Hrs</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.minutes || 0).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase">Mins</span>
                    </div>
                    <span>:</span>
                    <div className="flex flex-col items-center">
                        <span>{String(timeLeft.seconds || 0).padStart(2, '0')}</span>
                        <span className="text-[8px] uppercase">Secs</span>
                    </div>
                </div>
            </div>

            {/* Dot indicators */}
            {campaigns.length > 1 && (
                <div className="flex justify-center gap-1 mt-1">
                    {campaigns.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsSliding(true);
                                setTimeout(() => {
                                    setCurrentIndex(index);
                                    setIsSliding(false);
                                }, 300);
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-yellow-400'
                                : 'bg-yellow-400/40 hover:bg-yellow-400/60'
                                }`}
                            aria-label={`Go to campaign ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CampaignCountdown;
