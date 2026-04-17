import React from 'react';
import { useTryOn } from './TryOnProvider';
import CameraFeed from './CameraFeed';
import ARCanvas from './ARCanvas';

export default function VirtualTryOnModal() {
    const { isTryOnActive, toggleTryOn, isCameraLoading, cameraError } = useTryOn();

    if (!isTryOnActive) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-full h-full md:w-3/4 md:h-5/6 bg-gray-900 overflow-hidden md:rounded-xl shadow-2xl">

                {/* Close Button */}
                <button
                    onClick={() => toggleTryOn(false)}
                    className="absolute top-4 right-4 z-50 text-white bg-black bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 w-10 h-10 flex items-center justify-center transition-all"
                >
                    X
                </button>

                {/* Loading State */}
                {isCameraLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 text-white">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                        <p className="text-xl font-outfit">Loading Camera & AI Engine...</p>
                    </div>
                )}

                {/* Error State */}
                {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-40 text-white px-8 text-center bg-red-900 bg-opacity-50">
                        <p className="text-2xl font-bold mb-2">Camera Error</p>
                        <p className="font-outfit">{cameraError}</p>
                        <button
                            onClick={() => toggleTryOn(false)}
                            className="mt-6 px-6 py-2 bg-white text-black font-semibold rounded"
                        >
                            Close
                        </button>
                    </div>
                )}

                {/* The Components */}
                <CameraFeed />

                {/* We place ARCanvas on top of the camera if camera is active */}
                {!isCameraLoading && !cameraError && (
                    <ARCanvas />
                )}
            </div>
        </div>
    );
}
