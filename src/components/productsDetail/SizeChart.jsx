import React, { useEffect, useState } from "react";
import { getCollections, getCollectionById } from "../../apis/Collections";

export default function SizeChart({ productId }) {
    const [showTops, setShowTops] = useState(false);
    const [showBottoms, setShowBottoms] = useState(false);
    const [showMenTops, setShowMenTops] = useState(false);
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

    const menTopsData = [
        { label: "Chest", s: "39.5", m: "41.75", l: "45", xl: "47.5", xxl: "50.5" },
        { label: "Length", s: "27", m: "28", l: "29", xl: "30", xxl: "30.63" },
        { label: "Shoulder", s: "17", m: "18", l: "19", xl: "20", xxl: "21.5" },
        { label: "Sleeve", s: "25", m: "25.5", l: "26", xl: "26.88", xxl: "27.13" },
    ];

    const defaultColumns = [
        { header: "XS", key: "xs" },
        { header: "S", key: "s" },
        { header: "M", key: "m" },
        { header: "L", key: "l" },
    ];

    const menColumns = [
        { header: "S", key: "s" },
        { header: "M", key: "m" },
        { header: "L", key: "l" },
        { header: "XL", key: "xl" },
        { header: "XXL", key: "xxl" },
    ];

    useEffect(() => {
        const checkCollections = async () => {
            if (!productId) return;

            try {
                // 1. Get all collections
                const collections = await getCollections();

                // 2. Filter for relevant collections
                const relevantCollections = collections.filter(c =>
                    ["Tops", "Bottoms", "Co-ord sets", "Men's Top"].includes(c.title)
                );

                let isTop = false;
                let isBottom = false;
                let isMenTop = false;

                // 3. Check each relevant collection for the product
                for (const collection of relevantCollections) {
                    const { products } = await getCollectionById(collection.id);
                    const productInCollection = products.some(p => p.productId === productId);

                    if (productInCollection) {
                        if (collection.title === "Tops") isTop = true;
                        if (collection.title === "Bottoms") isBottom = true;
                        if (collection.title === "Men's Top") isMenTop = true;
                        if (collection.title === "Co-ord sets") {
                            isTop = true;
                            isBottom = true;
                        }
                    }
                }

                setShowTops(isTop);
                setShowBottoms(isBottom);
                setShowMenTops(isMenTop);
            } catch (error) {
                console.error("Error checking size chart collections:", error);
            } finally {
                setLoading(false);
            }
        };

        checkCollections();
    }, [productId]);

    const Table = ({ title, data, columns }) => (
        <div className="mb-8">
            {title && <h3 className="text-center text-2xl mb-4 font-bold">{title}</h3>}
            <div className="overflow-hidden border-2 border-black rounded-sm">
                <table className="w-full text-center border-collapse bg-[#FFF8E7]">
                    <thead>
                        <tr className="bg-[#0e2a1a] text-white">
                            <th className="w-1/5 py-3 px-2 border-r-2 border-b-2 border-black font-bold uppercase tracking-wider">
                                SIZE
                                <div className="text-[10px] font-normal normal-case leading-none mt-0.5">(in inches)</div>
                            </th>
                            {columns.map((col, index) => (
                                <th key={col.key} className={`w-1/5 py-3 px-2 border-b-2 border-black font-bold uppercase tracking-wider ${index !== columns.length - 1 ? 'border-r-2' : ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="text-black font-bold text-lg">
                        {data.map((row, rowIndex) => (
                            <tr key={row.label}>
                                <td className={`py-3 px-2 border-r-2 border-black ${rowIndex !== data.length - 1 ? 'border-b-2' : ''}`}>{row.label}</td>
                                {columns.map((col, colIndex) => (
                                    <td key={col.key} className={`py-3 px-2 ${colIndex !== columns.length - 1 ? 'border-r-2 border-black' : ''} ${rowIndex !== data.length - 1 ? 'border-b-2 border-black' : ''}`}>
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) return null; // Or a skeleton loader
    if (!showTops && !showBottoms && !showMenTops) return null;

    const isCoords = showTops && showBottoms;

    return (
        <div className="mt-8 font-antikor w-full max-w-xl mx-auto">
            {showTops && <Table title={isCoords ? "Tops" : ""} data={topsData} columns={defaultColumns} />}
            {showBottoms && <Table title={isCoords ? "Bottoms" : ""} data={bottomsData} columns={defaultColumns} />}
            {showMenTops && <Table title="" data={menTopsData} columns={menColumns} />}
        </div>
    );
}
