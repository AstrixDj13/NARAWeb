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
import { FaPlus, FaShoppingCart } from "react-icons/fa";

const UGCSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playingVideo, setPlayingVideo] = useState(null); // Track which video is playing

    // Redux state for Cart
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const accessToken = useSelector((state) => state.user.accessToken);
    const cartId = useSelector((state) => state.cart.id);
    const dispatch = useDispatch();
    const [addingToCart, setAddingToCart] = useState(null); // Track which product is being added

    // Video filenames from public/ugc_videos
    const videoFiles = [
        "Faux 9 to 5 Crop Women's Blazer.mp4",
        "Ivy Tie- up Boho Skirt.mp4",
        "Laidback Luxe Trendy Shirt.mp4",
        "Sage Structured Trendy Top.mp4",
        "Tie-up Lounge Pants.mp4"
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch all collections to find "UGC_Collection"
                const collections = await getCollections();
                const ugcCollection = collections.find(c => c.title === "UGC_Collection");

                if (!ugcCollection) {
                    console.warn("UGC_Collection not found");
                    setLoading(false);
                    return;
                }

                // 2. Fetch products for the UGC collection
                const { products: collectionProducts } = await getCollectionById(ugcCollection.id);

                // 3. Match products with videos
                const matchedProducts = collectionProducts.map(product => {
                    // Normalize strings for comparison: remove all whitespace and convert to lowercase
                    const normalize = (str) => str.replace(/\s+/g, "").toLowerCase();

                    const matchingVideo = videoFiles.find(file =>
                        normalize(file.replace(".mp4", "")) === normalize(product.title)
                    );

                    if (matchingVideo) {
                        return {
                            ...product,
                            videoSrc: `/ugc_videos/${matchingVideo}`
                        };
                    }
                    return null;
                }).filter(p => p !== null);

                setProducts(matchedProducts);
            } catch (error) {
                console.error("Error fetching UGC data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Cart Logic (Duplicated/Adapted from ActionButtons.jsx)
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

    const handleAddToCart = async (e, product) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        if (addingToCart) return;
        setAddingToCart(product.productId);

        try {
            const variantId = product.variantId; // Ensure this exists from getCollectionById

            if (cartId) {
                await addAnotherItemToTheCart(cartId, variantId);
            } else if (isAuthenticated) {
                await createLoggedInCart(variantId, accessToken);
            } else {
                await createCartWithOneitem(variantId);
            }
        } finally {
            setAddingToCart(null);
        }
    };

    const toggleVideo = (e, index) => {
        e.preventDefault(); // Prevent link navigation if clicking video
        const video = document.getElementById(`ugc-video-${index}`);
        if (video) {
            if (video.paused) {
                video.play();
                setPlayingVideo(index);
            } else {
                video.pause();
                setPlayingVideo(null);
            }
        }
    };

    if (loading) return null; // Or a loader
    if (products.length === 0) return null;

    return (
        <section className="py-12 bg-white dark:!bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-8 text-black dark:!text-white uppercase tracking-wider">
                    See What People Are Wearing
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {products.map((product, index) => (
                        <div key={product.productId} className="relative group aspect-[9/16] overflow-hidden rounded-lg shadow-lg">
                            {/* Video */}
                            <video
                                id={`ugc-video-${index}`}
                                src={product.videoSrc}
                                className="w-full h-full object-cover"
                                loop
                                muted={playingVideo !== index} // Unmute when playing explicitly? Or keep muted? User said "shows the video". Usually UGC is sound on click.
                                playsInline
                                onClick={(e) => toggleVideo(e, index)}
                            // poster={product.imageSrc} // Use product image as poster
                            />

                            {/* Play Button Overlay (if paused) */}
                            {playingVideo !== index && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all cursor-pointer"
                                    onClick={(e) => toggleVideo(e, index)}
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            )}

                            {/* Product Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-100 transition-opacity">
                                <Link to={`/product/${encodeURIComponent(product.productId)}`} className="block hover:underline">
                                    <h3 className="text-sm font-bold truncate">{product.title}</h3>
                                    <p className="text-xs mb-2">INR {product.price}</p>
                                </Link>

                                <div className="flex gap-2 mt-2">
                                    <Link
                                        to={`/product/${encodeURIComponent(product.productId)}`}
                                        className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs py-2 px-2 rounded text-center transition-colors"
                                    >
                                        View Product
                                    </Link>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={addingToCart === product.productId}
                                        className="flex-1 bg-[#1F4A40] hover:bg-[#16332b] text-white text-xs py-2 px-2 rounded flex items-center justify-center gap-1 transition-colors"
                                    >
                                        {addingToCart === product.productId ? (
                                            "Adding..."
                                        ) : (
                                            <>
                                                <FaShoppingCart size={10} /> Add
                                            </>
                                        )}
                                    </button>
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
