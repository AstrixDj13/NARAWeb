import React, { useState, useEffect } from 'react';
import { getActiveCampaigns, calculateTimeLeft } from '../../utils/campaignUtils';

const CampaignCountdown = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState({});
    const [isSliding, setIsSliding] = useState(false);

    const activeCampaigns = getActiveCampaigns();
    const countdownCampaigns = activeCampaigns.filter(c => c.name || c.targetDate);
    const hasMarquee = activeCampaigns.some(c => c.marqueeMessage);

    if (countdownCampaigns.length === 0) return null;

    const currentCampaign = countdownCampaigns[currentIndex];

    // Update countdown every second
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentCampaign?.targetDate) {
                setTimeLeft(calculateTimeLeft(currentCampaign.targetDate));
            }
        }, 1000);

        // Initial calculation
        if (currentCampaign?.targetDate) {
            setTimeLeft(calculateTimeLeft(currentCampaign.targetDate));
        }

        return () => clearInterval(timer);
    }, [currentCampaign]);

    // Auto-slide every 10 seconds
    useEffect(() => {
        if (countdownCampaigns.length <= 1) return; // Don't slide if 0 or 1 campaign

        const slideTimer = setInterval(() => {
            setIsSliding(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % countdownCampaigns.length);
                setIsSliding(false);
            }, 300); // Transition duration
        }, 10000); // 10 seconds

        return () => clearInterval(slideTimer);
    }, [countdownCampaigns.length]);

    return (
        <div className={`fixed ${hasMarquee ? 'top-6' : 'top-0'} left-0 w-full z-[60] flex justify-center items-center py-2 transition-colors duration-300 bg-[#0e2a1a] text-yellow-400`}>
            <div className="relative overflow-hidden w-full">
                <div
                    className={`flex flex-col items-center justify-center font-mono text-yellow-400 transition-all duration-300 ${isSliding ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'
                        }`}
                >
                    <div className="text-xs font-bold uppercase tracking-widest mb-1">
                        {currentCampaign.name}
                    </div>
                    {currentCampaign.targetDate && (
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
                    )}
                </div>

                {/* Dot indicators */}
                {countdownCampaigns.length > 1 && (
                    <div className="flex justify-center gap-1 mt-1">
                        {countdownCampaigns.map((_, index) => (
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
        </div>
    );
};

export default CampaignCountdown;
