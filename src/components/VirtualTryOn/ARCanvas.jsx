import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import GarmentOverlay from './GarmentOverlay';

export default function ARCanvas() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
            {/* Canvas with transparent background (alpha: true by default in R3F) */}
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }} // Prevent blocking UI clicks
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <Environment preset="city" />

                <GarmentOverlay />
            </Canvas>
        </div>
    );
}
