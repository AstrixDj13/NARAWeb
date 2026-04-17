import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const TryOnContext = createContext(null);

export const useTryOn = () => {
    const context = useContext(TryOnContext);
    if (!context) {
        throw new Error('useTryOn must be used within a TryOnProvider');
    }
    return context;
};

export const TryOnProvider = ({ children }) => {
    const [isTryOnActive, setIsTryOnActive] = useState(false);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    const [cameraError, setCameraError] = useState(null);

    // Ref to hold the latest pose keypoints from MoveNet
    // We use a ref instead of state to prevent rapid re-renders of the entire tree
    // since keypoints update 30-60 times a second. The 3D overlay will read from this ref.
    const keypointsRef = useRef([]);

    // The video element reference, which the PoseEngine will analyze
    const videoRef = useRef(null);

    // Function to initialize or teardown the AR session
    const toggleTryOn = (status) => {
        setIsTryOnActive(status);
    };

    const value = {
        isTryOnActive,
        toggleTryOn,
        isCameraLoading,
        setIsCameraLoading,
        cameraError,
        setCameraError,
        keypointsRef,
        videoRef,
    };

    return (
        <TryOnContext.Provider value={value}>
            {children}
        </TryOnContext.Provider>
    );
};
