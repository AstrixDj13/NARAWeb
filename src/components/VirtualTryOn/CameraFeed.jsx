import React, { useEffect } from 'react';
import { useTryOn } from './TryOnProvider';
import { initializeDetector, detectPose } from './PoseEngine';

export default function CameraFeed() {
    const { videoRef, setCameraError, setIsCameraLoading, keypointsRef } = useTryOn();

    useEffect(() => {
        let animationFrameId;
        let isActive = true;

        const startCamera = async () => {
            try {
                setIsCameraLoading(true);
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' }
                });

                if (videoRef.current && isActive) {
                    videoRef.current.srcObject = stream;
                }

                // Initialize TensorFlow detector
                await initializeDetector();
                setIsCameraLoading(false);
            } catch (err) {
                console.error("Error accessing camera: ", err);
                setCameraError(err.message || 'Camera permission denied.');
                setIsCameraLoading(false);
            }
        };

        startCamera();

        const poseDetectionLoop = async () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                const pose = await detectPose(videoRef.current);
                if (pose && pose.keypoints) {
                    keypointsRef.current = pose.keypoints;
                }
            }
            if (isActive) {
                animationFrameId = requestAnimationFrame(poseDetectionLoop);
            }
        };

        const handleLoadedData = () => {
            poseDetectionLoop();
        };

        const videoEl = videoRef.current;
        if (videoEl) {
            videoEl.addEventListener('loadeddata', handleLoadedData);
        }

        return () => {
            isActive = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            if (videoEl) {
                videoEl.removeEventListener('loadeddata', handleLoadedData);
                // Stop all video tracks
                const stream = videoEl.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };
    }, [setIsCameraLoading, setCameraError, videoRef, keypointsRef]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
                display: 'none', // We render it invisibly, the ARCanvas will draw the webcam behind the scene, or we can optionally make this visible and set Canvas background to transparent.
            }}
        />
    );
}
