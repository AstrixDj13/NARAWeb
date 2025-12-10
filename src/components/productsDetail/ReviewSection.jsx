import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa6';
import { toast } from 'sonner';
import { fetchReviews, submitReview } from '../../apis/Reviews';

const ReviewSection = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (productId) {
            loadReviews();
            const interval = setInterval(() => {
                loadReviews();
            }, 30000); // Update every 30 seconds

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
            await submitReview({ ...newReview, productId });
            toast.success("Review submitted successfully!");
            setNewReview({ userName: '', rating: 5, comment: '' });
            loadReviews(); // Refresh list
        } catch (error) {
            toast.error("Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 font-antikor">Customer Reviews</h2>

            {/* Summary */}
            <div className="flex items-center gap-4 mb-8">
                <div className="text-4xl font-bold">{averageRating}</div>
                <div>
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"} />
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
                </div>
            </div>

            {/* Review List */}
            <div className="space-y-6 mb-12">
                {isLoading ? (
                    <p>Loading reviews...</p>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-6 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold">{review.userName}</h4>
                                <span className="text-xs text-gray-500">{new Date(review.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="flex text-yellow-400 text-sm mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                ))}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                )}
            </div>

            {/* Add Review Form */}
            <div className="bg-gray-50 p-6 rounded-lg dark:bg-gray-900">
                <h3 className="text-lg font-bold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
                            value={newReview.userName}
                            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                            placeholder="Your Name (Optional)"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                    className={`text-2xl focus:outline-none ${star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                    <FaStar />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Review</label>
                        <textarea
                            className="w-full p-2 border rounded dark:bg-black dark:border-gray-700"
                            rows="4"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            placeholder="Share your thoughts..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewSection;
