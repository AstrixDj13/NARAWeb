import React, { useState, useEffect } from 'react';

const CampaignCountdown = ({ campaignName, targetDate, isScrolled, theme }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
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

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const textColorClass = isScrolled
        ? theme === "light"
            ? "text-black"
            : "text-white"
        : theme === "light"
            ? "text-black"
            : "text-white";

    return (
        <div className={`hidden lg:flex flex-col items-center justify-center font-mono ${textColorClass}`}>
            <div className="text-xs font-bold uppercase tracking-widest mb-1">
                {campaignName}
            </div>
            <div className="flex gap-2 text-sm font-medium">
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase">Days</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase">Hrs</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase">Mins</span>
                </div>
                <span>:</span>
                <div className="flex flex-col items-center">
                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase">Secs</span>
                </div>
            </div>
        </div>
    );
};

export default CampaignCountdown;
