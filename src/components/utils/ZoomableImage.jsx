import { useState, useRef, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.2;
const PAN_SPEED = 0.3; // Adjust this (0.1 = very slow, 1 = normal, 2 = fast)

export default function ZoomableImage({ img, active }) {
    const [loading, setLoading] = useState(true);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hasInteracted, setHasInteracted] = useState(false);

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setHasInteracted(false);
    }, [img, active]);

    // Attach wheel listener with passive: false to ensure preventDefault works
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!active) return;

            const delta = Math.sign(e.deltaY);

            if (delta === 0) return;

            setHasInteracted(true);

            setScale((prev) => {
                const next =
                    delta < 0
                        ? prev + ZOOM_STEP // scroll up → zoom in
                        : prev - ZOOM_STEP; // scroll down → zoom out

                const newScale = Math.min(Math.max(next, MIN_ZOOM), MAX_ZOOM);

                // Reset position when zooming back to 1
                if (newScale === 1) {
                    setPosition({ x: 0, y: 0 });
                }

                return newScale;
            });
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, [active]);

    const handleMouseMove = (e) => {
        if (!active || scale <= 1) return;

        const rect = containerRef.current.getBoundingClientRect();

        // Calculate mouse position as percentage
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Calculate how much the image has grown
        const scaleFactor = scale - 1;

        // Direct panning: mouse right → image right
        const panX = (x - 0.5) * scaleFactor * 100 * PAN_SPEED;
        const panY = (y - 0.5) * scaleFactor * 100 * PAN_SPEED * (-1);

        setPosition({ x: panX, y: panY });
    };

    const handleMouseLeave = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
        setHasInteracted(false);
    };

    return (
        <Box
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            sx={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
                cursor: scale > 1 ? "move" : "zoom-in",
                touchAction: "none",
            }}
        >
            {/* Tooltip */}
            {!hasInteracted && active && (
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded z-10 pointer-events-none">
                    Scroll to zoom
                </div>
            )}

            {loading && (
                <Skeleton variant="rectangular" width="100%" height="100%" />
            )}

            <img
                ref={imageRef}
                src={img}
                draggable={false}
                onLoad={() => setLoading(false)}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale}) translate(${position.x}%, ${position.y}%)`,
                    transformOrigin: "center center",
                    transition: scale === 1 ? "transform 0.2s ease-out" : "none",
                    willChange: "transform",
                }}
            />
        </Box>
    );
}