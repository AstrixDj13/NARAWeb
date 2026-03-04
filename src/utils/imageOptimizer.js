export const getOptimizedImageUrl = (url, width) => {
    if (!url) return '';
    // Check if string already has width parameter to avoid duplicates
    if (url.includes('width=')) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&format=webp`;
};
