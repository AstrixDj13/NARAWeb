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
                <Breadcrumb items={[{ label: "Home", link: "/" }, { label: "Exchange Policy" }]} />
                <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white uppercase tracking-wide">
                    Policies
                </h1>

                <div className="space-y-12">

                    {/* Exchange Policy Section */}
                    <section id="exchange" className="bg-gray-50 dark:bg-[#1C1C1C] p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 text-[#1E7B74] uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-2">
                            Exchange Policy
                        </h2>
                        <div className="text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                            <p className="font-medium">
                                Exchanges are accepted under the following conditions:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Exchange requests must be made within 14–30 days of delivery</li>
                                <li>Items must be unused, unworn, unwashed, and in original condition</li>
                                <li>Original tags and packaging must be intact and attached</li>
                                <li>Sale or discounted items are final sale and not eligible for exchange</li>
                                <li>Proof of purchase (order number or receipt) is mandatory</li>
                                <li>Requests made after the exchange window will not be accepted</li>
                                <li>Items showing signs of wear, damage, or alteration will be rejected</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
            <FooterSection />
        </div>
    );
};

export default Policies;
