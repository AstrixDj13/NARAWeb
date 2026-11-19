import { useState, useEffect } from 'react';
import { getCollectionById } from '../apis/Collections';
import { SALE_COLLECTION_ID } from '../utils/collectionLinks';

// Products in the BLACK FRIDAY SALE collection are already priced at 50% off in Shopify,
// so the struck-through "original" price shown next to them is double the current price.
export const SALE_PRICE_MULTIPLIER = 2;

let saleIdsPromise = null;

const fetchSaleProductIds = async () => {
    try {
        const { products } = await getCollectionById(SALE_COLLECTION_ID);
        return new Set((products || []).map((p) => p.productId));
    } catch (error) {
        console.error('Failed to fetch sale collection:', error);
        saleIdsPromise = null; // allow a retry on the next page
        return new Set();
    }
};

/** True when the product (Shopify product gid) is in the BLACK FRIDAY SALE collection. */
export const useSaleProduct = (productId) => {
    const [isSale, setIsSale] = useState(false);

    useEffect(() => {
        if (!productId) return;
        if (!saleIdsPromise) saleIdsPromise = fetchSaleProductIds();
        let cancelled = false;
        saleIdsPromise.then((ids) => {
            if (!cancelled) setIsSale(ids.has(productId));
        });
        return () => {
            cancelled = true;
        };
    }, [productId]);

    return isSale;
};
