export const campaigns = [
    {
        id: "xmas",
        name: "X-Mas Sale (Flat 25% off)! LIVE NOW!",
        startDate: "2025-12-20T00:00:00+05:30",
        endDate: "2025-12-26T00:00:00+05:30",
        targetDate: "2025-12-26T00:00:00+05:30",
        offerTag: "25% Off",
        collectionTitle: "X'MAS Sale",
        marqueeMessage: "Christmas Sale: FLAT 25% OFF*!"
    },
    {
        id: "b1g1",
        name: "Stock Clearance:B1G1! LIVE NOW!",
        startDate: "2025-12-27T00:00:00+05:30",
        endDate: "2026-01-01T00:00:00+05:30",
        targetDate: "2026-01-01T00:00:00+05:30",
        offerTag: "Buy1Get1",
        collectionTitle: "Buy1-Get1 Sale",
        marqueeMessage: "B1G1 on the Entire MEL Edit!"
    },
    {
        id: "laya",
        name: "Laya: The Work Edit, LIVE NOW!",
        startDate: "2026-01-02T00:00:00+05:30",
        endDate: "2026-02-07T17:29:59+05:30",
        targetDate: "2026-02-07T17:29:59+05:30",
        offerTag: "",
        showOnExpiry: true,
        collectionTitle: "LAYA: The Work Edit",
        marqueeMessage: "LAYA: The Work Edit, LIVE NOW!"
    }
];

export const isActive = (campaign) => {
    const now = new Date();
    const start = new Date(campaign.startDate);
    const end = new Date(campaign.endDate);

    // Check if campaign is active based on dates OR if it's set to show on expiry
    if (campaign.showOnExpiry) {
        // If showOnExpiry is true, we only care that it has started
        return now >= start;
    }

    return now >= start && now <= end;
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
