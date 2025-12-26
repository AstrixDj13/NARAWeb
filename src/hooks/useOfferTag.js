import { useState, useEffect } from 'react';
import { getCollections, getCollectionById } from '../apis/Collections';
import { getActiveCampaigns } from '../utils/campaignUtils';

let offerCollectionsPromise = null;

const fetchOfferCollections = async () => {
    try {
        const collections = await getCollections();
        const activeCampaigns = getActiveCampaigns();
        const productOfferMap = new Map(); // productId -> offerTag

        for (const campaign of activeCampaigns) {
            const collection = collections.find(c => c.title === campaign.collectionTitle);
            if (collection) {
                const { products } = await getCollectionById(collection.id);
                products.forEach(p => {
                    // Only set if not already set (priority to first campaign found, or could refine logic)
                    if (!productOfferMap.has(p.productId)) {
                        productOfferMap.set(p.productId, campaign.offerTag);
                    }
                });
            }
        }

        return productOfferMap;
    } catch (error) {
        console.error("Failed to fetch offer collections:", error);
        return new Map();
    }
};

export const useOfferTag = (productId) => {
    const [offerTag, setOfferTag] = useState(null);

    useEffect(() => {
        if (!offerCollectionsPromise) {
            offerCollectionsPromise = fetchOfferCollections();
        }

        offerCollectionsPromise.then((productOfferMap) => {
            setOfferTag(productOfferMap.get(productId) || null);
        });
    }, [productId]);

    return offerTag;
};
