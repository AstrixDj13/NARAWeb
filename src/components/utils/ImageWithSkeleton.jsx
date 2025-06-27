import { useState } from "react";
import { Box, Skeleton } from "@mui/material";
export default function ImageWithSkeleton({ img, name }) {
  const [loadingImage, setLoadingImage] = useState(true);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {loadingImage && (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      )}
      <img
        title="image"
        src={img}
        alt={`product-model-${name}`}
        className={`${
          loadingImage ? "opacity-0" : "opacity-100"
        } w-full h-full object-cover `}
        onLoad={() => setLoadingImage(false)}
      />
    </Box>
  );
}
