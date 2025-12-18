import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCollections, getCollectionById } from "../../apis/Collections";
import createCart, {
    addItemToCart,
    createAuthenticatedCart,
} from "../../apis/Cart";
import {
    setActiveCartId,
    setCheckoutUrl,
    setProductsinCart,
    setTotalQuantityInCart,
} from "../../store";
import CartToast from "../utils/CartToast";
import { toast as customToast } from "react-toastify";
import { FaShoppingCart, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const UGCSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);

    const videoRefs = useRef([]);
    const manuallyPaused = useRef(new Set());
    const manuallyUnmuted = useRef(new Set());

    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const accessToken = useSelector((state) => state.user.accessToken);
    const cartId = useSelector((state) => state.cart.id);
    const dispatch = useDispatch();

    const videoFiles = [
        "Faux 9 to 5 Crop Women's Blazer.mp4",
        "Ivy Tie- up Boho Skirt.mp4",
        "Laidback Luxe Trendy Shirt.mp4",
        "Sage Structured Trendy Top.mp4",
        "Tie-up Lounge Pants.mp4",
    ];

    /* ---------------- FETCH PRODUCTS ---------------- */
    useEffect(() => {
        const fetchData = async () => {
            const collections = await getCollections();
            const ugcCollection = collections.find(
                (c) => c.title === "UGC_Collection"
            );
            if (!ugcCollection) return;

            const { products } = await getCollectionById(ugcCollection.id);
            const normalize = (s) => s.replace(/\s+/g, "").toLowerCase();

            const matched = products
                .map((p) => {
                    const match = videoFiles.find(
                        (f) =>
                            normalize(f.replace(".mp4", "")) === normalize(p.title)
                    );
                    return match ? { ...p, videoSrc: `/ugc_videos/${match}` } : null;
                })
                .filter(Boolean);

            setProducts(matched);
            setLoading(false);
        };

        fetchData();
    }, []);

    /* ---------------- DESKTOP AUTOPLAY ---------------- */
    useEffect(() => {
        if (isMobile) return;

        videoRefs.current.forEach((video, index) => {
            if (!video) return;

            if (!manuallyUnmuted.current.has(index)) {
                video.muted = true;
            }

            if (!manuallyPaused.current.has(index)) {
                video.play().catch(() => { });
            }
        });
    }, [products]);

    /* ---------------- MOBILE SCROLL AUTOPLAY ---------------- */
    useEffect(() => {
        if (!isMobile) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = Number(entry.target.dataset.index);
                    const video = videoRefs.current[index];
                    if (!video) return;

                    if (manuallyPaused.current.has(index)) return;

                    if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
                        if (!manuallyUnmuted.current.has(index)) {
                            video.muted = true;
                        }
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: [0.6] }
        );

        videoRefs.current.forEach((video, index) => {
            if (!video) return;
            video.dataset.index = index;
            observer.observe(video);
        });

        return () => observer.disconnect();
    }, [products]);

    /* ---------------- PLAY / PAUSE (CENTER) ---------------- */
    const togglePlay = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const video = videoRefs.current[index];
        if (!video) return;

        if (video.paused) {
            manuallyPaused.current.delete(index);
            video.play().catch(() => { });
        } else {
            manuallyPaused.current.add(index);
            video.pause();
        }
    };

    /* ---------------- MUTE / UNMUTE (TOP RIGHT) ---------------- */
    const toggleMute = (e, index) => {
        e.preventDefault();
        e.stopPropagation();

        const video = videoRefs.current[index];
        if (!video) return;

        video.muted = !video.muted;

        if (!video.muted) {
            manuallyUnmuted.current.add(index);
        } else {
            manuallyUnmuted.current.delete(index);
        }
    };

    if (loading || !products.length) return null;

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 uppercase">
                    See What People Are Wearing
                </h2>

                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:overflow-visible">
                    {products.map((product, index) => (
                        <div
                            key={product.productId}
                            className="relative aspect-[9/16] min-w-[75%] sm:min-w-0 snap-center overflow-hidden rounded-lg shadow-lg"
                        >
                            {/* VIDEO */}
                            <video
                                ref={(el) => (videoRefs.current[index] = el)}
                                src={product.videoSrc}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                            />

                            {/* MUTE / UNMUTE BUTTON */}
                            <button
                                onClick={(e) => toggleMute(e, index)}
                                className="absolute top-3 right-3 z-10 bg-black/60 text-white p-2 rounded-full"
                            >
                                {videoRefs.current[index]?.muted ? (
                                    <FaVolumeMute size={14} />
                                ) : (
                                    <FaVolumeUp size={14} />
                                )}
                            </button>

                            {/* PLAY / PAUSE OVERLAY */}
                            <div
                                onClick={(e) => togglePlay(e, index)}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                                    <svg
                                        className="w-6 h-6 text-black ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>

                            {/* PRODUCT INFO */}
                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 text-white">
                                <Link to={`/product/${encodeURIComponent(product.productId)}`}>
                                    <h3 className="text-sm font-bold truncate">
                                        {product.title}
                                    </h3>
                                    <p className="text-xs mb-2">INR {product.price}</p>
                                </Link>

                                <button
                                    className="mt-2 w-full bg-[#1F4A40] py-2 rounded text-xs flex items-center justify-center gap-1"
                                >
                                    <FaShoppingCart size={10} /> Add to cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UGCSection;
