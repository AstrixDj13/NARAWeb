import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IoClose } from 'react-icons/io5';

const SpinningWheel = ({ onClose }) => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({ phone: '', name: '' });
    const [rotation, setRotation] = useState(0);
    const [copied, setCopied] = useState(false);

    const segments = [
        { text: '10% OFF', color: '#1F4A40', value: 'lose' },
        { text: '₹300 OFF', color: '#2a6357', value: 'win_300' },
        { text: '₹200 OFF', color: '#1F4A40', value: 'win_200' },
        { text: '15% OFF', color: '#2a6357', value: 'win_15' },
        { text: '20% OFF', color: '#1F4A40', value: 'win_20' },
        { text: '30% OFF', color: '#2a6357', value: 'win_30' },
    ];

    const handleSpin = async () => {
        if (!formData.phone) {
            alert("Please enter your phone number to spin!");
            return;
        }

        const randomIndex = Math.floor(Math.random() * segments.length);
        const selectedSegment = segments[randomIndex];

        const segmentDegree = 360 / segments.length;
        const spins = 5;

        // We want the selected segment's center to end up at the pointer.
        // Assuming 0deg is top, conic gradient goes clockwise.
        // The pointer is at right, which is 90deg from top.
        const segmentCenter = (randomIndex * segmentDegree) + (segmentDegree / 2);

        // The amount to rotate so that the segmentCenter moves to 90deg.
        // Final position = (segmentCenter + rotation) % 360 === 90
        // => rotation = 90 - segmentCenter

        const targetRotation = (spins * 360) + (90 - segmentCenter);

        setSpinning(true);
        setRotation(targetRotation);

        setTimeout(async () => {
            setSpinning(false);
            setResult(selectedSegment);

            try {
                let customerId = localStorage.getItem('user_id');
                let anonymousId = localStorage.getItem('anonymous_id');
                if (!anonymousId && !customerId) {
                    anonymousId = uuidv4();
                    localStorage.setItem('anonymous_id', anonymousId);
                }

                await fetch(`/api/spinning-wheel/spin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phoneNumber: formData.phone,
                        name: formData.name,
                        customerId,
                        anonymousId,
                        result: selectedSegment.text.replace('\n', ' ')
                    })
                });
                localStorage.setItem('hasSpunWheel', 'true');
            } catch (err) {
                console.error(err);
            }
        }, 5000);
    };

    const codeMap = {
        '10% OFF': 'LUCKY10',
        '₹300 OFF': 'LUCKY300',
        '₹200 OFF': 'LUCKY200',
        '15% OFF': 'LUCKY15',
        '20% OFF': 'LUCKY20',
        '30% OFF': 'LUCKY30'
    };

    const handleCopyCode = () => {
        const code = codeMap[result.text];
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const conicGradientStr = segments.map((seg, i) => `${seg.color} ${i * (360 / segments.length)}deg ${(i + 1) * (360 / segments.length)}deg`).join(', ');

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 transition-opacity font-antikor">
            <div className="bg-white text-black rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.3)] relative border border-gray-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-black/50 hover:text-black z-20 transition-colors">
                    <IoClose size={32} />
                </button>

                {/* Left Side - Wheel */}
                <div className="md:w-1/2 p-4 md:p-8 flex items-center justify-center bg-[#f5f5f5] overflow-hidden relative min-h-[350px] md:min-h-[450px]">
                    <div className="relative w-64 h-64 md:w-96 md:h-96 shadow-2xl flex-shrink-0 aspect-square md:mr-8 my-4">
                        {/* Pointer */}
                        <div className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 w-0 h-0 border-t-[10px] md:border-t-[15px] border-t-transparent border-b-[10px] md:border-b-[15px] border-b-transparent border-r-[20px] md:border-r-[30px] border-r-[#1F4A40] z-20 drop-shadow-lg" />

                        {/* Wheel Container */}
                        <div
                            className="w-full h-full rounded-full border-[8px] border-[#1F4A40] relative transition-transform"
                            style={{
                                background: `conic-gradient(${conicGradientStr})`,
                                transform: `rotate(${rotation}deg)`,
                                transitionDuration: spinning ? '5000ms' : '0ms',
                                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
                            }}
                        >
                            {/* Center dot */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-10 shadow-[0_0_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-[#1F4A40] font-bold text-2xl tracking-tighter">
                                AV
                            </div>

                            {/* Text for segments */}
                            {segments.map((seg, i) => {
                                const deg = (i * (360 / segments.length)) + ((360 / segments.length) / 2);
                                return (
                                    <div
                                        key={i}
                                        className="absolute top-1/2 left-1/2 w-[48%] h-8 origin-left flex items-center justify-end pr-3 md:pr-6"
                                        style={{ transform: `translateY(-50%) rotate(${deg - 90}deg)` }}
                                    >
                                        <div className="transform rotate-[90deg]">
                                            <span className="text-white font-bold text-[11px] md:text-sm whitespace-pre text-center block" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                                {seg.text}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white text-black">
                    {!result ? (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight text-black">You've got one spin - make it count!</h1>
                                <p className="text-gray-600 text-xs md:text-sm">Not everything is planned. Some things are meant to be won.</p>
                            </div>

                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full bg-gray-100 text-black p-3 rounded text-base font-medium outline-none focus:ring-2 focus:ring-[#1F4A40] border border-gray-300"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Your name (optional)"
                                className="w-full bg-gray-100 text-black p-3 rounded text-base font-medium outline-none focus:ring-2 focus:ring-[#1F4A40] border border-gray-300"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <p className="text-[10px] md:text-xs text-gray-500 mt-2 mb-4 text-center">By registering, I agree to <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.</p>

                            <button
                                onClick={handleSpin}
                                disabled={spinning}
                                className="w-full bg-[#1F4A40] hover:bg-[#16332b] text-white font-bold py-3 rounded text-lg transition-colors disabled:opacity-50"
                            >
                                {spinning ? 'Spinning...' : 'Try your Luck!'}
                            </button>
                            <button onClick={onClose} className="w-full text-center text-xs text-gray-500 hover:text-black mt-4 transition-colors">
                                No, I don't feel lucky.
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 flex flex-col h-full justify-center">
                            {result.value === 'lose' ? (
                                <>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-black">So close - here's something anyway ✷</h2>
                                    <p className="text-gray-600 text-sm md:text-base mb-2">10% OFF fallback</p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl md:text-3xl font-bold text-[#1F4A40] mb-2">You unlocked a special offer ✷</h2>
                                    <p className="text-gray-600 text-sm md:text-base mb-2">Use your code within the next 15 minutes.</p>
                                </>
                            )}

                            {/* Coupon Code Box */}
                            <div className="bg-gray-100 border-2 border-dashed border-[#1F4A40] p-4 rounded-lg text-2xl tracking-widest font-mono text-[#1F4A40] font-bold shadow-inner">
                                {codeMap[result.text]}
                            </div>

                            {/* Copy Code Button */}
                            <button
                                onClick={handleCopyCode}
                                className="w-full bg-[#1F4A40] hover:bg-[#16332b] text-white font-bold py-2.5 rounded text-base transition-colors"
                            >
                                {copied ? '✓ Code Copied!' : 'Copy Code'}
                            </button>

                            {/* Disclaimers */}
                            <p className="text-xs text-gray-500 text-center">Redeemable at checkout</p>
                            <p className="text-xs text-gray-500 text-center">Not applicable on sale items</p>

                            <button
                                onClick={onClose}
                                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded text-lg transition-colors mt-2"
                            >
                                Shop now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpinningWheel;
