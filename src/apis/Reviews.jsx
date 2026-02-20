import api from "../utils/backendApi";

export const fetchReviews = async (productId) => {
    try {
        const response = await api.get(`/api/reviews/${encodeURIComponent(productId)}`);
        return response.data.reviews || [];
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
};

export const submitReview = async (reviewData) => {
    try {
        const response = await api.post("/api/reviews", reviewData);
        return response.data;
    } catch (error) {
        console.error("Error submitting review:", error);
        throw error;
    }
};
