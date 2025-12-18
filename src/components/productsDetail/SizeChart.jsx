import React, { useEffect, useState } from "react";
import { getCollections, getCollectionById } from "../../apis/Collections";

export default function SizeChart({ productId }) {
    const [showTops, setShowTops] = useState(false);
    const [showBottoms, setShowBottoms] = useState(false);
    const [loading, setLoading] = useState(true);

    const topsData = [
        { label: "Chest", xs: "34", s: "36", m: "38", l: "40" },
        { label: "Waist", xs: "28", s: "30", m: "32", l: "34" },
        { label: "Hip", xs: "38", s: "40", m: "42", l: "44" },
    ];

    const bottomsData = [
        { label: "Waist", xs: "26", s: "28", m: "30", l: "32" },
        { label: "Hip", xs: "36", s: "38", m: "40", l: "42" },
        { label: "Thigh", xs: "24", s: "25", m: "26", l: "27" },
        { label: "Side", xs: "42", s: "42", m: "42.5", l: "42.5" },
    ];

    useEffect(() => {
        const checkCollections = async () => {
            if (!productId) return;

            try {
                // 1. Get all collections
                const collections = await getCollections();

                // 2. Filter for relevant collections
                const relevantCollections = collections.filter(c =>
                    ["Tops", "Bottoms", "Co-ord sets"].includes(c.title)
                );

                let isTop = false;
                let isBottom = false;

                // 3. Check each relevant collection for the product
                for (const collection of relevantCollections) {
                    const { products } = await getCollectionById(collection.id);
                    const productInCollection = products.some(p => p.productId === productId);

                    if (productInCollection) {
                        if (collection.title === "Tops") isTop = true;
                        if (collection.title === "Bottoms") isBottom = true;
                        if (collection.title === "Co-ord sets") {
                            isTop = true;
                            isBottom = true;
                        }
                    }
                }

                setShowTops(isTop);
                setShowBottoms(isBottom);
            } catch (error) {
                console.error("Error checking size chart collections:", error);
            } finally {
                setLoading(false);
            }
        };

        checkCollections();
    }, [productId]);

    const Table = ({ title, data }) => (
        <div className="mb-8">
            <h3 className="text-center text-2xl mb-4 font-outfit">{title}</h3>
            <div className="overflow-hidden border-2 border-black rounded-sm">
                <table className="w-full text-center border-collapse bg-[#FFF8E7]">
                    <thead>
                        <tr className="bg-[#0e2a1a] text-white">
                            <th className="w-1/5 py-3 px-2 border-r-2 border-b-2 border-black font-bold uppercase tracking-wider">
                                SIZE
                                <div className="text-[10px] font-normal normal-case leading-none mt-0.5">(in inches)</div>
                            </th>
                            <th className="w-1/5 py-3 px-2 border-r-2 border-b-2 border-black font-bold uppercase tracking-wider">XS</th>
                            <th className="w-1/5 py-3 px-2 border-r-2 border-b-2 border-black font-bold uppercase tracking-wider">S</th>
                            <th className="w-1/5 py-3 px-2 border-r-2 border-b-2 border-black font-bold uppercase tracking-wider">M</th>
                            <th className="w-1/5 py-3 px-2 border-b-2 border-black font-bold uppercase tracking-wider">L</th>
                        </tr>
                    </thead>
                    <tbody className="text-black font-bold text-lg">
                        {data.map((row, index) => (
                            <tr key={row.label}>
                                <td className={`py-3 px-2 border-r-2 border-black ${index !== data.length - 1 ? 'border-b-2' : ''}`}>{row.label}</td>
                                <td className={`py-3 px-2 border-r-2 border-black ${index !== data.length - 1 ? 'border-b-2' : ''}`}>{row.xs}</td>
                                <td className={`py-3 px-2 border-r-2 border-black ${index !== data.length - 1 ? 'border-b-2' : ''}`}>{row.s}</td>
                                <td className={`py-3 px-2 border-r-2 border-black ${index !== data.length - 1 ? 'border-b-2' : ''}`}>{row.m}</td>
                                <td className={`py-3 px-2 ${index !== data.length - 1 ? 'border-b-2 border-black' : ''}`}>{row.l}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) return null; // Or a skeleton loader
    if (!showTops && !showBottoms) return null;

    return (
        <div className="mt-8 font-serif w-full max-w-xl mx-auto">
            {showTops && <Table title="Tops" data={topsData} />}
            {showBottoms && <Table title="Bottoms" data={bottomsData} />}
        </div>
    );
}
