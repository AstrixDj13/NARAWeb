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
import { toast } from "sonner";
import CartToast from "../utils/CartToast";
import { toast as customToast } from "react-toastify";
import { FaShoppingCart, FaVolumeMute, FaVolumeUp, FaHeart, FaTrophy } from "react-icons/fa";

const UGCSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    const [openSizeSelector, setOpenSizeSelector] = useState(null); // Track which product has size selector open


    const [votes, setVotes] = useState({});
    const [userVotes, setUserVotes] = useState({});

    const [mutedStates, setMutedStates] = useState({});

    const videoRefs = useRef([]);
    const manuallyPaused = useRef(new Set());
    const manuallyUnmuted = useRef(new Set());
    const lastVotedTime = useRef(0);

    const isMobile = window.matchMedia("(max-width: 640px)").matches;

    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const user = useSelector((state) => state.user);
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
                    return match ? { ...p, videoSrc: `/ugc_videos/${match}`, videoFilename: match } : null;
                })
                .filter(Boolean);

            setProducts(matched);

            // Initialize mute states
            const initialMuted = {};
            matched.forEach((_, i) => {
                initialMuted[i] = true;
            });
            setMutedStates(initialMuted);

            setLoading(false);
        };

        fetchData();

    }, []);

    /* ---------------- FETCH VOTES ---------------- */
    useEffect(() => {
        const fetchVotes = async () => {
            // Skip fetching if user voted recently (prevent see-saw effect)
            if (Date.now() - lastVotedTime.current < 2000) return;

            try {
                const userId = user?.id || user?._id; // Handle different ID formats
                const query = userId ? `?userId=${userId}` : '';
                const response = await fetch(`/api/ugc-votes${query}`);
                const data = await response.json();
                if (data.votes) {
                    setVotes(data.votes);
                }
                if (data.userVotedVideos) {
                    // Merge server-side user votes with local storage (server takes precedence if logged in)
                    setUserVotes(prev => ({ ...prev, ...data.userVotedVideos }));
                }
            } catch (error) {
                console.error("Error fetching votes:", error);
            }
        };

        // Load user votes from local storage
        const storedUserVotes = localStorage.getItem('ugc_user_votes');
        if (storedUserVotes) {
            setUserVotes(JSON.parse(storedUserVotes));
        }

        fetchVotes();

        // Poll for real-time updates every 2 seconds
        const interval = setInterval(fetchVotes, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleVote = async (e, videoFilename) => {
        e.preventDefault();
        e.stopPropagation();

        lastVotedTime.current = Date.now();

        const hasVoted = userVotes[videoFilename];
        const newHasVoted = !hasVoted;

        // Optimistic update
        setVotes(prev => ({
            ...prev,
            [videoFilename]: Math.max(0, (prev[videoFilename] || 0) + (newHasVoted ? 1 : -1))
        }));

        setUserVotes(prev => {
            const newState = { ...prev, [videoFilename]: newHasVoted };
            localStorage.setItem('ugc_user_votes', JSON.stringify(newState));
            return newState;
        });

        try {
            const userId = user?.id || user?._id;
            await fetch('/api/ugc-votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId: videoFilename, increment: newHasVoted, userId })
            });
        } catch (error) {
            console.error("Error submitting vote:", error);
            // Revert on error (optional, keeping it simple for now)
        }
    };

    // Calculate winner
    const winningVideo = Object.entries(votes).reduce((max, [id, count]) => {
        return count > (max.count || 0) ? { id, count } : max;
    }, { id: null, count: 0 });

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

        const newMutedState = !video.muted;
        video.muted = newMutedState;

        setMutedStates(prev => ({
            ...prev,
            [index]: newMutedState
        }));

        if (!newMutedState) {
            manuallyUnmuted.current.add(index);
        } else {
            manuallyUnmuted.current.delete(index);
        }
    };

    // Cart Logic
    const createCartWithOneitem = async (variantId) => {
        try {
            const cart = await createCart(variantId);
            const cartId = cart.id;
            const checkoutUrl = cart.checkoutUrl;
            customToast(<CartToast />);
            dispatch(setActiveCartId(cartId));
            dispatch(setCheckoutUrl(checkoutUrl));
            dispatch(setProductsinCart(cart.lines.edges));
            dispatch(setTotalQuantityInCart(cart.totalQuantity));
            localStorage.setItem("cartId", cartId);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const createLoggedInCart = async (variantId, customerAccessToken) => {
        try {
            const cart = await createAuthenticatedCart(variantId, customerAccessToken);
            const cartId = cart.id;
            const checkoutUrl = cart.checkoutUrl;
            customToast(<CartToast />);
            dispatch(setActiveCartId(cartId));
            dispatch(setCheckoutUrl(checkoutUrl));
            dispatch(setProductsinCart(cart.lines.edges));
            dispatch(setTotalQuantityInCart(cart.totalQuantity));
            localStorage.setItem("cartId", cartId);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const addAnotherItemToTheCart = async (cartId, variantId) => {
        try {
            const response = await addItemToCart(cartId, variantId);
            const itemsQuantity = response?.totalQuantity;
            dispatch(setTotalQuantityInCart(itemsQuantity));
            dispatch(setCheckoutUrl(response?.checkoutUrl));
            const products = response?.lines?.edges;
            dispatch(setProductsinCart(products));
            customToast(<CartToast />);
        } catch (error) {
            console.error(error);
            if (error.message.includes("GraphQL error(s)")) {
                toast.error("Something went wrong");
            } else {
                toast.info(error.message);
            }
        }
    };

    const handleAddToCart = async (e, variantId, productId) => {
        e.preventDefault();
        e.stopPropagation();

        if (addingToCart) return;
        setAddingToCart(productId);

        try {
            if (cartId) {
                await addAnotherItemToTheCart(cartId, variantId);
            } else if (isAuthenticated) {
                await createLoggedInCart(variantId, accessToken);
            } else {
                await createCartWithOneitem(variantId);
            }
        } finally {
            setAddingToCart(null);
            setOpenSizeSelector(null); // Close selector after adding
        }
    };

    const toggleSizeSelector = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenSizeSelector(openSizeSelector === productId ? null : productId);
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

                            {/* TROPHY ICON (WINNER) */}
                            {winningVideo.count > 0 && winningVideo.id === product.videoFilename && (
                                <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-black p-2 rounded-full shadow-lg animate-bounce">
                                    <FaTrophy size={16} />
                                </div>
                            )}

                            {/* MUTE / UNMUTE BUTTON */}
                            <button
                                onClick={(e) => toggleMute(e, index)}
                                className="absolute top-3 right-3 z-10 bg-black/60 text-white p-2 rounded-full"
                            >
                                {mutedStates[index] ? (
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
                                <h3 className="text-sm font-bold truncate">
                                    {product.title}
                                </h3>
                                <p className="text-xs mb-2">INR {product.price}</p>

                                {/* VOTE BUTTON */}
                                <button
                                    onClick={(e) => handleVote(e, product.videoFilename)}
                                    className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-full mb-2 transition-colors w-fit"
                                >
                                    <FaHeart className={userVotes[product.videoFilename] ? "text-red-500" : "text-white"} />
                                    <span>{votes[product.videoFilename] || 0}</span>
                                </button>

                                <div className="flex gap-2 mt-2 relative">
                                    <Link
                                        to={`/product/${encodeURIComponent(product.productId)}`}
                                        className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded text-xs flex items-center justify-center transition-colors border border-white/30"
                                    >
                                        View
                                    </Link>
                                    <div className="flex-1 relative">
                                        <button
                                            onClick={(e) => toggleSizeSelector(e, product.productId)}
                                            disabled={addingToCart === product.productId}
                                            className="w-full bg-[#1F4A40] hover:bg-[#16332b] text-white py-2 rounded text-xs flex items-center justify-center gap-1 transition-colors"
                                        >
                                            {addingToCart === product.productId ? (
                                                "Adding..."
                                            ) : (
                                                <>
                                                    <FaShoppingCart size={10} /> Add
                                                </>
                                            )}
                                        </button>

                                        {/* SIZE SELECTOR DROPDOWN */}
                                        {openSizeSelector === product.productId && (
                                            <div className="absolute bottom-full left-0 w-full mb-1 bg-white rounded shadow-lg overflow-hidden z-20 flex flex-col-reverse">
                                                {product.variants?.map((variant) => (
                                                    <button
                                                        key={variant.id}
                                                        onClick={(e) => handleAddToCart(e, variant.id, product.productId)}
                                                        className="w-full text-black text-xs py-2 hover:bg-gray-100 text-center border-b border-gray-100 last:border-0"
                                                    >
                                                        {variant.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UGCSection;
