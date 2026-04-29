import React, { useEffect } from "react";
import Navbar from "../components/Navbar/NavbarUpdated";
import FooterSection from "../components/home/FooterSectionUpdated";
import Breadcrumb from "../components/common/Breadcrumb";

const Policies = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white dark:bg-black min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow pt-32 pb-16 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto w-full">
                <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Return Policy" }]} />
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center text-gray-900 dark:text-white uppercase tracking-widest">
                    Returns & Exchanges
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-12 italic font-medium">
                    We want you to love what you wear from NARA 🤍
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Returns Section */}
                    <div className="bg-gray-50 dark:bg-[#1C1C1C] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-[#1E7B74] rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                Returns
                            </h2>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                            <p>We accept returns within <span className="font-bold text-[#1E7B74]">10 days</span> of delivery.</p>
                            <p className="bg-[#1E7B74]/10 p-3 rounded-lg border-l-4 border-[#1E7B74] text-sm italic">
                                A ₹99 return fee will be deducted from your refund to cover reverse logistics.
                            </p>
                        </div>
                    </div>

                    {/* Exchanges Section */}
                    <div className="bg-gray-50 dark:bg-[#1C1C1C] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-[#1E7B74] rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                Exchanges
                            </h2>
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                            <p>We offer exchanges within <span className="font-bold text-[#1E7B74]">10 days</span> of delivery for:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>A different size, or</li>
                                <li>A different product of equal value</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Conditions Section */}
                <section className="bg-[#1E7B74]/5 dark:bg-[#1E7B74]/10 p-8 rounded-2xl border border-[#1E7B74]/20 mb-12">
                    <h2 className="text-xl font-bold mb-6 text-[#1E7B74] uppercase tracking-widest text-center">
                        Conditions for Returns & Exchanges
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Unused", desc: "Product must be in its original condition" },
                            { title: "Tags Intact", desc: "All original tags must be attached" },
                            { title: "Not Washed", desc: "Item must not be washed or cleaned" },
                            { title: "No Damage", desc: "Item must not be damaged or altered" }
                        ].map((condition, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-[#1E7B74] font-bold mb-1 uppercase text-sm tracking-tighter">{condition.title}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{condition.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* How to Request Section */}
                <section className="text-center bg-gray-900 text-white p-10 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">
                        How to Request
                    </h2>
                    <p className="text-gray-400 mb-8">
                        To initiate a return or exchange, please contact us with your order number and details.
                    </p>
                    <a 
                        href="mailto:info@narawear.com" 
                        className="inline-block bg-[#1E7B74] hover:bg-[#155A55] text-white font-bold py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg mb-4"
                    >
                        info@narawear.com
                    </a>
                    <div className="text-sm text-gray-500 mt-4 uppercase tracking-widest font-semibold">
                        Our team will guide you through the next steps.
                    </div>
                </section>
            </div>
            <FooterSection />
        </div>
    );
};

export default Policies;
