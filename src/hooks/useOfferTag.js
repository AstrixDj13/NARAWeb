import { useState, useEffect } from 'react';
import { getCollections, getCollectionById } from '../apis/Collections';

let offerCollectionsPromise = null;

const fetchOfferCollections = async () => {
    try {
        const collections = await getCollections();
        const xmasCollection = collections.find(c => c.title === "X'MAS Sale");
        const b1g1Collection = collections.find(c => c.title === "Buy1-Get1 Sale");

        const xmasProductIds = new Set();
        const b1g1ProductIds = new Set();

        if (xmasCollection) {
            const { products } = await getCollectionById(xmasCollection.id);
            products.forEach(p => xmasProductIds.add(p.productId));
        }

        if (b1g1Collection) {
            const { products } = await getCollectionById(b1g1Collection.id);
            products.forEach(p => b1g1ProductIds.add(p.productId));
        }

        return { xmasProductIds, b1g1ProductIds };
    } catch (error) {
        console.error("Failed to fetch offer collections:", error);
        return { xmasProductIds: new Set(), b1g1ProductIds: new Set() };
    }
};

export const useOfferTag = (productId) => {
    const [offerTag, setOfferTag] = useState(null);

    useEffect(() => {
        if (!offerCollectionsPromise) {
            offerCollectionsPromise = fetchOfferCollections();
        }

        offerCollectionsPromise.then(({ xmasProductIds, b1g1ProductIds }) => {
            if (xmasProductIds.has(productId)) {
                setOfferTag("25% Off");
            } else if (b1g1ProductIds.has(productId)) {
                setOfferTag("Buy 1 Get 1");
            } else {
                setOfferTag(null);
            }
        });
    }, [productId]);

    return offerTag;
};
