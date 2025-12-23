export const campaigns = [
    {
        name: "X-Mas Sale (Flat 25% off)! LIVE NOW!",
        targetDate: "2025-12-25T00:00:00",
        offerTag: "25% Off"
    },
    {
        name: "Stock Clearance:B1G1! LIVE NOW!",
        targetDate: "2026-01-01T00:00:00",
        offerTag: "Buy 1 Get 1"
    },
];

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
