import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { getCollections, getCollectionById } from "../../apis/Collections";
import { addItemToCart } from "../../apis/Cart";
import { useDispatch, useSelector } from "react-redux";
import { setTotalQuantityInCart, setCheckoutUrl, setProductsinCart } from "../../store";
import { toast } from "sonner";
import CartToast from "../utils/CartToast";
import { toast as customToast } from "react-toastify";

const YouMayAlsoLike = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState({});
    const cartId = useSelector((state) => state.cart.id);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const collections = await getCollections();
                const cGradeCollection = collections.find(
                    (c) => c.title === "C Grade Products"
                );

                if (cGradeCollection) {
                    const { products } = await getCollectionById(cGradeCollection.id);
                    setProducts(products);
                }
            } catch (error) {
                console.error("Error fetching C Grade Products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleAddToCart = async (product) => {
        if (!cartId) {
            toast.error("Cart not found. Please add an item to cart first.");
            return;
        }

        setAddingToCart((prev) => ({ ...prev, [product.productId]: true }));

        try {
            const response = await addItemToCart(cartId, product.variantId);
            const itemsQuantity = response?.totalQuantity;
            dispatch(setTotalQuantityInCart(itemsQuantity));
            dispatch(setCheckoutUrl(response?.checkoutUrl));
            const productsInCart = response?.lines?.edges;
            dispatch(setProductsinCart(productsInCart));
            customToast(<CartToast />);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to add to cart");
        } finally {
            setAddingToCart((prev) => ({ ...prev, [product.productId]: false }));
        }
    };

    if (loading || products.length === 0) return null;

    return (
        <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-bold mb-4 px-4">You May Also Like</h3>
            <div className="overflow-x-auto flex gap-4 px-4 pb-4 no-scrollbar">
                {products.map((product) => (
                    <div
                        key={product.productId}
                        className="flex-none w-32 flex flex-col gap-1"
                    >
                        <Link
                            to={`/product/${encodeURIComponent(product.productId)}?camefrompage=Cart`}
                            className="flex flex-col gap-2"
                        >
                            <div className="relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                                <LazyLoadImage
                                    effect="opacity"
                                    src={product.imageSrc}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium truncate">{product.title}</p>
                                <p className="text-sm text-gray-600">
                                    {product.price} INR
                                </p>
                            </div>
                        </Link>
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart[product.productId]}
                            className="mt-1 w-full bg-[#1F4A40] text-white text-xs py-2 rounded disabled:opacity-50"
                        >
                            {addingToCart[product.productId] ? "Adding..." : "Add to Cart"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default YouMayAlsoLike;
