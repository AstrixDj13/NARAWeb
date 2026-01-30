export const campaigns = [
    {
        id: "xmas",
        name: "X-Mas Sale (Flat 25% off)! LIVE NOW!",
        targetDate: "2025-12-26T00:00:00",
        offerTag: "25% Off",
        collectionTitle: "X'MAS Sale",
        marqueeMessage: "Christmas Sale: FLAT 25% OFF*!"
    },
    {
        id: "b1g1",
        name: "Stock Clearance:B1G1! LIVE NOW!",
        targetDate: "2026-01-01T00:00:00",
        offerTag: "Buy1Get1",
        collectionTitle: "Buy1-Get1 Sale",
        marqueeMessage: "B1G1 on the Entire MEL Edit!"
    },
    {
        id: "laya",
        name: "Laya: The Work Edit! Coming Soon!",
        targetDate: "2026-02-07T00:00:00",
        offerTag: "",
        collectionTitle: "LAYA: The Work Edit",
        marqueeMessage: "LAYA: The Work Edit! Coming Soon!"
    }
];

export const isActive = (campaign) => {
    const now = new Date();
    const target = new Date(campaign.targetDate);
    return target > now;
};

export const getActiveCampaigns = () => {
    return campaigns.filter(isActive);
};

export function calculateTimeLeft(targetDate) {
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
