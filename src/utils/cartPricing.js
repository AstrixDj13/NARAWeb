import { campaigns, isActive } from './campaignUtils';

export const calculateCartPricing = (productsInCart) => {
    if (!productsInCart || productsInCart.length === 0) {
        return { subtotal: 0, savings: 0, itemsPricing: {} };
    }

    const melCampaign = campaigns.find(c => c.id === "mel-collection");
    const isMelCampaignActive = melCampaign ? isActive(melCampaign) : false;

    const bogoCampaign = campaigns.find(c => c.id === "b1g1-new" || c.collectionTitle === "BUY 1 GET 1 FREE");
    const isBogoCampaignActive = bogoCampaign ? isActive(bogoCampaign) : false;

    let bogoItems = [];
    let otherItems = [];

    productsInCart.forEach(item => {
        const price = parseFloat(item?.node?.merchandise?.price?.amount || 0);
        const quantity = item?.node?.quantity || 0;
        const id = item?.node?.id; // cartLineId
        const edges = item?.node?.merchandise?.product?.collections?.edges || [];
        const inMel = edges.some(e => e?.node?.title?.trim().toUpperCase() === "MEL");
        const inBogo = edges.some(e => e?.node?.title?.trim().toUpperCase() === "BUY 1 GET 1 FREE");
        const isBogo = inBogo && isBogoCampaignActive;
        
        for (let i = 0; i < quantity; i++) {
            const itemData = {
                cartLineId: id,
                originalPrice: price,
                isMel: inMel && isMelCampaignActive,
                isBogo: isBogo
            };
            if (isBogo) {
                bogoItems.push(itemData);
            } else {
                otherItems.push(itemData);
            }
        }
    });

    // Sort descending by original price (highest stays, lowest becomes free)
    bogoItems.sort((a, b) => b.originalPrice - a.originalPrice);

    const totalBogoItems = bogoItems.length;
    const freeItemsCount = Math.floor(totalBogoItems / 2);

    let subtotal = 0;
    let savings = 0;
    const itemsPricing = {};

    const processItem = (item, isFree) => {
        if (!itemsPricing[item.cartLineId]) {
            itemsPricing[item.cartLineId] = {
                paidCount: 0,
                freeCount: 0,
                originalPrice: item.originalPrice,
                isMel: item.isMel,
                isBogo: item.isBogo,
                totalEffectivePrice: 0,
                totalStrikeoutPrice: 0,
                totalSavings: 0
            };
        }
        
        const info = itemsPricing[item.cartLineId];
        
        if (isFree) {
            info.freeCount += 1;
            // The effective price is 0.
            // The strikeout price is its original price (or +200 if we want to be consistent).
            const strikeoutPrice = item.isMel ? item.originalPrice : (item.originalPrice + 200);
            
            info.totalStrikeoutPrice += strikeoutPrice;
            info.totalSavings += strikeoutPrice; 
            savings += strikeoutPrice;
        } else {
            info.paidCount += 1;
            // It's paid. Apply original logic.
            const effectivePrice = item.isMel ? item.originalPrice * 0.70 : item.originalPrice;
            const strikeoutPrice = item.isMel ? item.originalPrice : (item.originalPrice + 200);
            const itemSavings = item.isMel ? (item.originalPrice * 0.30) : 200;
            
            info.totalEffectivePrice += effectivePrice;
            info.totalStrikeoutPrice += strikeoutPrice;
            info.totalSavings += itemSavings;
            
            subtotal += effectivePrice;
            savings += itemSavings;
        }
    };

    // Process BOGO items
    bogoItems.forEach((item, index) => {
        const isFree = index >= totalBogoItems - freeItemsCount;
        processItem(item, isFree);
    });

    // Process other items
    otherItems.forEach(item => {
        processItem(item, false); // Never free via BOGO
    });

    return { subtotal, savings, itemsPricing };
};
