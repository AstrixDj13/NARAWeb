# BOGO Campaign Reinstatement Reference

This rule serves as permanent memory for how to reinstate the BUY 1 GET 1 (BOGO) campaign for the NARA Web store, as it was temporarily removed on October 8, 2026.

When asked to reinstate the BOGO campaign, make the following changes to the codebase:

### 1. `src/utils/campaignUtils.js`
Add the following campaign objects back into the `campaigns` array to enable the pricing logic globally:

```javascript
    {
        id: "b1g1",
        name: "Stock Clearance:B1G1! LIVE NOW!",
        startDate: "2025-12-27T00:00:00+05:30",
        endDate: "2026-01-01T00:00:00+05:30",
        targetDate: "2026-01-01T00:00:00+05:30",
        offerTag: "Buy1Get1",
        collectionTitle: "Buy1-Get1 Sale",
        marqueeMessage: "B1G1 on the Entire MEL Edit!"
    },
    {
        id: "b1g1-new",
        name: "", // Showing in the countdown area
        offerTag: "B1G1", // The tag applied to products
        showOnExpiry: true, // This MUST be true if you omit dates
        collectionTitle: "BUY 1 GET 1 FREE",
        marqueeMessage: "B1G1 free live now!*"
    }
```

### 2. `src/components/home/TopSection.jsx`
Reinstate the BOGO collection fetching and banner rendering in the TopSection:

- Find the collection inside `fetchCollections`:
```javascript
const bogo = fetchedCollections.find(c => c.title.trim().toUpperCase() === "BUY 1 GET 1 FREE");
```

- Push it to the `banners` array:
```javascript
if (bogo) banners.push(bogo);
```

- Adjust the delay for the BOGO banner inside the timeout logic:
```javascript
} else if (title.includes("BUY 1 GET 1")) {
  delay = 5000;
```

- In the carousel render logic, prevent the text from displaying if it's the BOGO banner (if you want the graphic to speak for itself):
```javascript
{!banner.title.toUpperCase().includes("BUY 1 GET 1") && !banner.isVideo && (
  <h2 className="...">
    {banner.title}
  </h2>
)}
```

### Notes
- The core cart calculation logic inside `src/utils/cartPricing.js` has not been deleted, it simply looks for campaigns with the `b1g1-new` ID or the title `BUY 1 GET 1 FREE`. Just reinstating the items in `campaignUtils.js` above automatically reenables all BOGO pricing and tags!
