import api from "../utils/backendApi";

export const fetchReviews = async (productId) => {
    try {
        const response = await api.get(`/api/reviews?productId=${encodeURIComponent(productId)}`);
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

export const uploadReviewPhotos = async (files) => {
    try {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("photos", file);
        });

        // The endpoint uses multipart/form-data, our axios instance should handle it
        const response = await api.post("/api/reviews/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading review photos:", error);
        throw error;
    }
};
