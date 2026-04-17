import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTryOn } from './TryOnProvider';

export default function GarmentOverlay() {
    const meshRef = useRef();
    const { keypointsRef, videoRef } = useTryOn();
    const { viewport } = useThree();

    useFrame(() => {
        // We map MoveNet keypoints to Three.js coordinates
        const keypoints = keypointsRef.current;
        const video = videoRef.current;

        if (!meshRef.current || !keypoints || keypoints.length === 0 || !video) return;

        // MoveNet Keypoint Indices:
        // 5: left_shoulder, 6: right_shoulder, 11: left_hip, 12: right_hip
        const leftShoulder = keypoints.find(k => k.name === 'left_shoulder');
        const rightShoulder = keypoints.find(k => k.name === 'right_shoulder');

        if (leftShoulder && rightShoulder && leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
            // Calculate the midpoint between shoulders
            const centerX = (leftShoulder.x + rightShoulder.x) / 2;
            const centerY = (leftShoulder.y + rightShoulder.y) / 2;

            // Normalize coords to [-1, 1] (WebGL coords)
            const nx = (centerX / video.videoWidth) * 2 - 1;
            const ny = -(centerY / video.videoHeight) * 2 + 1; // Y is inverted in WebGL relative to DOM

            // Map to viewport coordinates
            const mappedX = (nx * viewport.width) / 2;
            const mappedY = (ny * viewport.height) / 2;

            // Calculate width based on shoulder distance
            const shoulderDx = leftShoulder.x - rightShoulder.x;
            const shoulderDy = leftShoulder.y - rightShoulder.y;
            const pixelDistance = Math.sqrt(shoulderDx * shoulderDx + shoulderDy * shoulderDy);

            const normalizedDist = pixelDistance / video.videoWidth;
            const meshWidth = normalizedDist * viewport.width * 1.5; // Scale factor for the garment

            // Update position
            meshRef.current.position.x = mappedX;
            // Lower garment slightly below shoulders
            meshRef.current.position.y = mappedY - (meshWidth * 0.4);

            // Update scale (assuming base mesh is 1x1 unit)
            // We scale it proportionally
            meshRef.current.scale.set(meshWidth, meshWidth * 1.5, meshWidth * 0.5);
        }
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            {/* Box as a placeholder garment. Replace with <primitive object={gltf.scene} /> later */}
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#ff0055" opacity={0.8} transparent />
        </mesh>
    );
}
