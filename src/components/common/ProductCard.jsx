import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import VideoLazy from '../loaders/VideoLazy';
import { useOfferTag } from '../../hooks/useOfferTag';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const ProductCard = ({ product, className }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef(null);
    const offerTag = useOfferTag(product.id);

    // Extract images from product data
    // Handle both API structure (images.nodes) and hardcoded structure (imgSrc/images)
    const images = React.useMemo(() => {
        let imgs = [];

        // API structure: product.images.nodes
        if (product.images && product.images.nodes && product.images.nodes.length > 0) {
            imgs = product.images.nodes.map(node => node.url || node.src);
        }
        // Fallback to variant image if no product images
        else if (product.variants && product.variants.nodes && product.variants.nodes[0]?.image) {
            imgs = [product.variants.nodes[0].image.src];
        }
        // Hardcoded structure: product.images array (if added) or single imgSrc
        else if (product.images && Array.isArray(product.images)) {
            imgs = product.images;
        } else if (product.imgSrc) {
            imgs = [product.imgSrc];
        }

        return imgs;
    }, [product]);

    const price = React.useMemo(() => {
        if (product.price) return product.price; // Hardcoded
        if (product.variants?.nodes?.[0]?.price?.amount) {
            return `INR ${product.variants.nodes[0].price.amount}0`;
        }
        return '';
    }, [product]);

    const link = product.link || (product.handle ? `/products/${product.handle}` : (product.id ? `/product/${encodeURIComponent(product.id)}` : '#'));
    const title = product.title || product.description;
    const badge = product.badge || product.label;

    useEffect(() => {
        if (isHovered && images.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 1000); // Change image every 1 second
        } else {
            clearInterval(intervalRef.current);
            setCurrentImageIndex(0);
        }

        return () => clearInterval(intervalRef.current);
    }, [isHovered, images.length]);

    const currentImage = images[currentImageIndex];
    const isVideo = currentImage?.endsWith('.webm') || product.mediaType === 'video';

    const mobileUrl = isVideo ? null : getOptimizedImageUrl(currentImage, 400);
    const desktopUrl = isVideo ? null : getOptimizedImageUrl(currentImage, 600);

    return (
        <div
            className={`flex-shrink-0 w-[300px] sm:w-1/3 lg:w-full ${className || ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to={link}>
                <div className="w-full bg-gray-200 min-h-[350px] relative overflow-hidden rounded-lg aspect-[3/4]">
                    {isVideo ? (
                        <div className="w-full h-full object-center object-cover">
                            <VideoLazy
                                src={product.mediaUrl || currentImage}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-100">
                            <LazyLoadImage
                                src={desktopUrl}
                                srcSet={`${mobileUrl} 400w, ${desktopUrl} 600w`}
                                sizes="(max-width: 600px) 400px, 600px"
                                alt={title}
                                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
                                width="600"
                                height="800"
                                effect="opacity"
                            />
                        </div>
                    )}

                    {offerTag && (
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 z-10">
                            {offerTag}
                        </div>
                    )}

                    {badge && (
                        <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 py-1 px-2 rounded z-10">
                            <span className="text-xs font-bold font-mono text-black">
                                {badge}
                            </span>
                        </div>
                    )}

                    {/* Carousel Indicators (optional, for visual feedback) */}
                    {isHovered && images.length > 1 && (
                        <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                            {images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-black' : 'bg-gray-400'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-4 text-center">
                    <h3 className="text-lg font-medium font-mono text-black dark:!text-white truncate px-2">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm font-light font-mono text-gray-800 dark:text-gray-200">
                        {price}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
