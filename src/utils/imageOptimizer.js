export const getOptimizedImageUrl = (url, width, quality = 70) => {
    if (!url) return '';
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?width=${width}&quality=${quality}&format=webp`;
};

export const getSrcSet = (url, widths = [360, 540, 720], quality = 70) => {
    if (!url) return '';
    const cleanUrl = url.split('?')[0];
    return widths.map((w) => `${cleanUrl}?width=${w}&quality=${quality}&format=webp ${w}w`).join(', ');
};
