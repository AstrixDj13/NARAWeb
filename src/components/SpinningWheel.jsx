import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IoClose } from 'react-icons/io5';

const SpinningWheel = ({ onClose }) => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({ phone: '', name: '' });
    const [rotation, setRotation] = useState(0);

    const segments = [
        { text: '10% OFF', color: '#ff7b72', value: 'lose' },
        { text: '₹300 OFF', color: '#cc0000', value: 'win_300' },
        { text: '₹200 OFF', color: '#ff7b72', value: 'win_200' },
        { text: '15% OFF', color: '#990000', value: 'win_15' },
        { text: '20% OFF', color: '#ff7b72', value: 'win_20' },
        { text: '30% OFF', color: '#cc0000', value: 'win_30' },
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

    const conicGradientStr = segments.map((seg, i) => `${seg.color} ${i * (360 / segments.length)}deg ${(i + 1) * (360 / segments.length)}deg`).join(', ');

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 transition-opacity font-antikor">
            <div className="bg-black text-white rounded-lg max-w-4xl w-full flex flex-col md:flex-row shadow-[0_0_50px_rgba(255,255,255,0.1)] relative overflow-hidden border border-gray-800">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white z-20 transition-colors">
                    <IoClose size={32} />
                </button>

                {/* Left Side - Wheel */}
                <div className="md:w-1/2 p-4 md:p-8 flex items-center justify-center bg-[#050505] overflow-hidden relative min-h-[400px]">
                    <div className="relative w-80 h-80 md:w-96 md:h-96 shadow-2xl mr-4 md:mr-8">
                        {/* Pointer */}
                        <div className="absolute top-1/2 -right-6 md:-right-8 transform -translate-y-1/2 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[30px] border-r-[#ffd1dc] z-20 drop-shadow-lg" />

                        {/* Wheel Container */}
                        <div
                            className="w-full h-full rounded-full border-[8px] border-gray-200 relative transition-transform"
                            style={{
                                background: `conic-gradient(${conicGradientStr})`,
                                transform: `rotate(${rotation}deg)`,
                                transitionDuration: spinning ? '5000ms' : '0ms',
                                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
                            }}
                        >
                            {/* Center dot */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center text-black font-bold text-2xl tracking-tighter">
                                AV
                            </div>

                            {/* Text for segments */}
                            {segments.map((seg, i) => {
                                const deg = (i * (360 / segments.length)) + ((360 / segments.length) / 2);
                                return (
                                    <div
                                        key={i}
                                        className="absolute top-1/2 left-1/2 w-[50%] h-6 origin-left flex items-center pr-8"
                                        style={{ transform: `translateY(-50%) rotate(${deg - 90}deg)` }}
                                    >
                                        <span className="text-white font-bold text-[10px] md:text-xs origin-center tracking-wider text-center shadow-sm w-full block whitespace-pre-line rotate-90" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                                            {seg.text}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side - Content */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#0a0a0a]">
                    {!result ? (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">You've got one spin - make it count!</h1>
                                <p className="text-gray-400 text-xs md:text-sm">Not everything is planned. Some things are meant to be won.</p>
                            </div>

                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="w-full bg-white text-black p-3 rounded text-base font-medium outline-none focus:ring-2 focus:ring-yellow-400"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Your name (optional)"
                                className="w-full bg-white text-black p-3 rounded text-base font-medium outline-none focus:ring-2 focus:ring-yellow-400"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <p className="text-[10px] md:text-xs text-gray-500 mt-2 mb-4 text-center">By registering, I agree to <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.</p>

                            <button
                                onClick={handleSpin}
                                disabled={spinning}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded text-lg transition-colors disabled:opacity-50"
                            >
                                {spinning ? 'Spinning...' : 'Try your Luck!'}
                            </button>
                            <button onClick={onClose} className="w-full text-center text-xs text-gray-500 hover:text-white mt-4 transition-colors">
                                No, I don't feel lucky.
                            </button>
                        </div>
                    ) : (
                        <div className="text-center space-y-6 flex flex-col h-full justify-center">
                            {result.value === 'lose' ? (
                                <>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2">So close - here’s something anyway ✷</h2>
                                    <p className="text-gray-400 text-sm md:text-base mb-4">10% OFF fallback</p>

                                    <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg text-2xl tracking-widest font-mono text-yellow-400 font-bold mb-6 shadow-inner">
                                        {codeMap[result.text]}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-2">You unlocked a special offer ✷</h2>
                                    <p className="text-gray-400 text-sm md:text-base mb-4">Use your code within the next 15 minutes.</p>

                                    <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg text-2xl tracking-widest font-mono text-white font-bold mb-6 shadow-inner">
                                        {codeMap[result.text]}
                                    </div>
                                </>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded text-lg transition-colors"
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
