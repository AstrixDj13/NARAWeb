import { useState } from "react";
import { Box, Skeleton } from "@mui/material";
import { getOptimizedImageUrl } from "../../utils/imageOptimizer";

export default function ImageWithSkeleton({ img, name }) {
  const [loadingImage, setLoadingImage] = useState(true);

  const mobileUrl = getOptimizedImageUrl(img, 400);
  const desktopUrl = getOptimizedImageUrl(img, 600);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {loadingImage && (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      )}
      <img
        title="image"
        src={desktopUrl}
        srcSet={`${mobileUrl} 400w, ${desktopUrl} 600w`}
        sizes="(max-width: 600px) 400px, 600px"
        alt={`product-model-${name}`}
        loading="lazy"
        className={`${loadingImage ? "opacity-0" : "opacity-100"
          } w-full h-full object-cover `}
        onLoad={() => setLoadingImage(false)}
      />
    </Box>
  );
}
