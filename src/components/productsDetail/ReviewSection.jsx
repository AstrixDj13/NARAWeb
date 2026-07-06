import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa6';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'sonner';
import { fetchReviews, submitReview, uploadReviewPhotos } from '../../apis/Reviews';

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Modal state for images
    const [modalImages, setModalImages] = useState([]);
    const [modalIndex, setModalIndex] = useState(0);

    useEffect(() => {
        if (productId) {
            loadReviews();
            const interval = setInterval(() => {
                loadReviews();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [productId]);

    const loadReviews = async () => {
        setIsLoading(true);
        const data = await fetchReviews(productId);
        setReviews(data);
        setIsLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newReview.comment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedImageUrls = [];
            
            // Upload photos if any are selected
            if (selectedPhotos.length > 0) {
                const uploadResponse = await uploadReviewPhotos(selectedPhotos);
                if (uploadResponse.success && uploadResponse.urls) {
                    uploadedImageUrls = uploadResponse.urls;
                }
            }

            await submitReview({ ...newReview, productId, images: uploadedImageUrls });

            toast.success("Review submitted successfully!");

            setNewReview({
                userName: '',
                rating: 5,
                comment: ''
            });
            setSelectedPhotos([]);
            // Reset the file input visually
            const fileInput = document.getElementById("reviewPhotos");
            if (fileInput) fileInput.value = "";

            loadReviews();
        } catch (error) {
            toast.error("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhotoSelect = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            if (filesArray.length > 3) {
                toast.error("You can only upload up to 3 photos.");
                // Trim to 3 files
                setSelectedPhotos(filesArray.slice(0, 3));
            } else {
                setSelectedPhotos(filesArray);
            }
        }
    };

    const openModal = (images, index) => {
        setModalImages(images);
        setModalIndex(index);
    };

    const closeModal = () => {
        setModalImages([]);
        setModalIndex(0);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        setModalIndex((prev) => (prev + 1) % modalImages.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setModalIndex((prev) => (prev - 1 + modalImages.length) % modalImages.length);
    };

    const averageRating = reviews?.length
        ? (
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
        : 0;

    return (
        <div className="w-full">
            {/* Container */}
            <div className="max-w-7xl mx-auto px-4 mt-12 border-t border-gray-200 pt-8 dark:border-gray-800 text-black dark:!text-white">

                <h2 className="text-2xl font-bold mb-6 font-antikor">
                    Customer Reviews
                </h2>

                {/* Summary */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="text-4xl font-bold">
                        {averageRating}
                    </div>

                    <div>
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={
                                        i < Math.round(averageRating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }
                                />
                            ))}
                        </div>

                        <p className="text-sm mt-1">
                            {reviews?.length || 0} reviews
                        </p>
                    </div>
                </div>

                {/* Review List */}
                <div className="space-y-6 mb-12">
                    {isLoading ? (
                        <p>Loading reviews...</p>
                    ) : reviews?.length > 0 ? (
                        reviews.map((review) => (
                            <div
                                key={review.id}
                                className="border-b border-gray-100 pb-6 dark:border-gray-800"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold">
                                        {review.userName}
                                    </h4>

                                    <span className="text-xs">
                                        {new Date(review.timestamp).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex text-yellow-400 text-sm mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={
                                                i < review.rating
                                                    ? "text-yellow-400"
                                                    : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>

                                <p className="mb-3">{review.comment}</p>
                                
                                {/* Display attached images if any */}
                                {review.images && review.images.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {review.images.map((imgUrl, idx) => (
                                            <button 
                                                key={idx} 
                                                type="button"
                                                onClick={() => openModal(review.images, idx)}
                                                className="focus:outline-none"
                                            >
                                                <img 
                                                    src={imgUrl} 
                                                    alt={`Review photo ${idx + 1}`} 
                                                    className="w-20 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity cursor-zoom-in"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="italic">
                            No reviews yet. Be the first to review!
                        </p>
                    )}
                </div>

                {/* Add Review Form */}
                <div className="bg-gray-50 p-6 rounded-lg dark:bg-gray-900">
                    <h3 className="text-lg font-bold mb-4">
                        Write a Review
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name
                            </label>

                            <input
                                type="text"
                                className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 text-black dark:!text-white"
                                value={newReview.userName}
                                onChange={(e) =>
                                    setNewReview({
                                        ...newReview,
                                        userName: e.target.value
                                    })
                                }
                                placeholder="Your Name (Optional)"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Rating
                            </label>

                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                            setNewReview({
                                                ...newReview,
                                                rating: star
                                            })
                                        }
                                        className={`text-2xl focus:outline-none ${star <= newReview.rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                            }`}
                                    >
                                        <FaStar />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Review */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Review
                            </label>

                            <textarea
                                className="w-full p-2 border rounded dark:bg-black dark:border-gray-700 text-black dark:!text-white"
                                rows="4"
                                value={newReview.comment}
                                onChange={(e) =>
                                    setNewReview({
                                        ...newReview,
                                        comment: e.target.value
                                    })
                                }
                                placeholder="Share your thoughts..."
                                required
                            />
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Add Photos (up to 3)
                            </label>
                            <input
                                type="file"
                                id="reviewPhotos"
                                multiple
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-black file:text-white
                                    hover:file:bg-gray-800
                                    dark:file:bg-white dark:file:text-black dark:hover:file:bg-gray-200 cursor-pointer"
                            />
                            {/* Preview Selected Photos */}
                            {selectedPhotos.length > 0 && (
                                <div className="mt-3 flex gap-2 flex-wrap">
                                    {selectedPhotos.map((file, idx) => (
                                        <div key={idx} className="relative w-16 h-16">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${idx}`}
                                                className="w-full h-full object-cover rounded-md border border-gray-200 dark:border-gray-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                            {isSubmitting
                                ? "Submitting..."
                                : "Submit Review"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Image Modal */}
            {modalImages.length > 0 && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
                    onClick={closeModal}
                >
                    <button 
                        onClick={closeModal} 
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-[110]"
                        aria-label="Close modal"
                    >
                        <FaTimes size={24} />
                    </button>
                    
                    <div className="relative max-w-4xl w-full flex items-center justify-center h-full">
                        <img 
                            src={modalImages[modalIndex]} 
                            alt="Review preview full size" 
                            className="max-w-full max-h-[85vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                        
                        {modalImages.length > 1 && (
                            <>
                                <button 
                                    onClick={prevImage}
                                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all z-[110]"
                                    aria-label="Previous image"
                                >
                                    <FaChevronLeft size={20} />
                                </button>
                                <button 
                                    onClick={nextImage}
                                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-all z-[110]"
                                    aria-label="Next image"
                                >
                                    <FaChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;