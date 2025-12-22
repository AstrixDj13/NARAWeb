import { useState } from "react";
import { Box, Skeleton } from "@mui/material";

export default function ZoomableImage({ img, name }) {
    const [loadingImage, setLoadingImage] = useState(true);
    const [zoomStyle, setZoomStyle] = useState({});

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(2)",
        });
    };

    const handleMouseLeave = () => {
        setZoomStyle({
            transformOrigin: "center center",
            transform: "scale(1)",
        });
    };

    return (
        <Box sx={{ width: "100%", height: "100%", overflow: "hidden" }}>
            {loadingImage && (
                <Skeleton variant="rectangular" width="100%" height="100%" />
            )}
            <img
                title="image"
                src={img}
                alt={`product-model-${name}`}
                className={`${loadingImage ? "opacity-0" : "opacity-100"
                    } w-full h-full object-cover transition-transform duration-200 ease-out`}
                style={zoomStyle}
                onLoad={() => setLoadingImage(false)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            />
        </Box>
    );
}
