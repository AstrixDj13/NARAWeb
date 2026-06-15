import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { getCollections } from '../apis/Collections';

const AainaPopup = ({ onClose }) => {
    const [collectionId, setCollectionId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchId = async () => {
            try {
                const fetchedCollections = await getCollections();
                const aaina = fetchedCollections.find(c => c.title.trim().toUpperCase().includes("AAINA"));
                if (aaina) {
                    setCollectionId(aaina.id);
                }
            } catch (error) {
                console.error("Failed to fetch AAINA collection ID:", error);
            }
        };
        fetchId();
    }, []);

    const handleShopNow = () => {
        onClose();
        if (collectionId) {
            navigate(`/collection?id=${encodeURIComponent(collectionId)}`);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 transition-opacity font-antikor">
            <div className="relative flex flex-col items-center w-full max-w-[380px]">
                {/* Cancel Button */}
                <button onClick={onClose} className="absolute -top-12 -right-2 text-white/60 hover:text-white p-2 z-20 transition-all">
                    <IoClose size={32} />
                </button>

                <div className="w-full relative bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                    <img 
                        src="/aaina_banner.jpeg" 
                        alt="AAINA Collection" 
                        className="w-full h-auto max-h-[75vh] object-cover object-top" 
                    />
                    
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none"></div>
                    
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
                        {/* Shop Now Button */}
                        <button onClick={handleShopNow} className="bg-white hover:bg-gray-100 text-black px-8 py-2.5 font-mono font-bold text-xs sm:text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-xl rounded-sm">
                            Shop Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AainaPopup;
