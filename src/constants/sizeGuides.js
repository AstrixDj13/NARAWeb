import howToMeasureImg from "../assets/how-to-measure.jpg";

/**
 * ADAA - The Festive Edit Size Guide specification.
 * Measurements provided in Screenshot 2 (inches):
 * XS: Bust 32, Waist 28, Hip 36
 * S:  Bust 34, Waist 30, Hip 38
 * M:  Bust 36, Waist 32, Hip 40
 * L:  Bust 38, Waist 34, Hip 42
 */
export const ADAA_SIZE_GUIDE = {
  id: "adaa",
  name: "ADAA - The Festive Edit",
  title: "Size Guide",
  subtitle: "Body measurements, taken over light clothing.",
  note: "Find your fit. We've got the measurements.",
  sizes: ["XS", "S", "M", "L"],
  // Measurements in inches
  measurements: [
    {
      label: "Bust",
      values: { XS: 32, S: 34, M: 36, L: 38 },
    },
    {
      label: "Waist",
      values: { XS: 28, S: 30, M: 32, L: 34 },
    },
    {
      label: "Hip",
      values: { XS: 36, S: 38, M: 40, L: 42 },
    },
  ],
  illustration: howToMeasureImg,
};

// Check if a collection title or handle matches "ADAA - The Festive Edit"
export const isAdaaCollectionTitle = (title = "") => {
  if (!title) return false;
  const normalized = title.trim().toUpperCase();
  return (
    normalized.includes("ADAA") ||
    (normalized.includes("FESTIVE") && normalized.includes("EDIT"))
  );
};

// Helper to determine if a product belongs to ADAA
export const isAdaaProduct = (product) => {
  if (!product) return false;

  // Check collections in product.collections.edges (standard Shopify GraphQL format)
  if (product.collections?.edges?.length) {
    const matched = product.collections.edges.some((edge) =>
      isAdaaCollectionTitle(edge?.node?.title || edge?.node?.handle || "")
    );
    if (matched) return true;
  }

  // Check if product.collections is a direct array
  if (Array.isArray(product.collections)) {
    const matched = product.collections.some((c) =>
      isAdaaCollectionTitle(c?.title || c?.handle || "")
    );
    if (matched) return true;
  }

  // Check tags if applicable
  if (Array.isArray(product.tags)) {
    if (product.tags.some((tag) => isAdaaCollectionTitle(tag))) return true;
  }

  return false;
};

// Known Shopify taxonomy metaobject GIDs mapped to clean display labels
export const KNOWN_METAOBJECT_GIDS = {
  "611657777366": "Cotton Denim",
  "48261005526": "Wide Leg",
};

// Format values for Fit & Fabric details
export const formatFitFabricValue = (key, val) => {
  if (val === undefined || val === null || val === "") return null;

  if (typeof val === "string") {
    val = val.trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      try {
        const arr = JSON.parse(val);
        if (Array.isArray(arr)) {
          const valid = arr.filter(
            (item) => typeof item === "string" && !item.startsWith("gid://")
          );
          if (valid.length > 0) val = valid.join(", ");
        }
      } catch {}
    }
  }

  let str = String(val).trim();

  // If value contains a raw gid://, check if we have a known mapping
  if (str.includes("gid://shopify/Metaobject/")) {
    for (const [gidNumber, label] of Object.entries(KNOWN_METAOBJECT_GIDS)) {
      if (str.includes(gidNumber)) {
        str = label;
        break;
      }
    }
  }

  // If still a gid string, reject it completely so fallbacks are used
  if (str.startsWith("gid://") || str.includes("gid://shopify/")) {
    return null;
  }

  if (key === "stretch") {
    if (str.toLowerCase() === "no" || str.toLowerCase() === "false") return "Non-stretch";
    if (str.toLowerCase() === "yes" || str.toLowerCase() === "true") return "Stretchable";
  }
  if (key === "lining") {
    if (str.toLowerCase() === "no" || str.toLowerCase() === "false") return "No";
    if (str.toLowerCase() === "yes" || str.toLowerCase() === "true") return "Yes";
  }
  return str;
};

// Specific product presets
export const PRODUCT_FIT_FABRIC_MAP = {
  zoya: {
    fit: "Tailored Fit",
    fabric: "Cotton Denim",
    stretch: "Non-stretch",
    lining: "No",
  },
};

// Extract Fit & Fabric details for any product
export const getFitFabricDetails = (product) => {
  if (!product) {
    return {
      fit: "Fitted",
      fabric: "100% Cotton",
      stretch: "Non-stretch",
      lining: "Yes",
    };
  }

  const handle = (product?.handle || "").toLowerCase();
  const title = (product?.title || "").toLowerCase();

  // 1. Read from product metafields queried from Shopify
  const rawFit =
    product?.fitFabricDetails?.fit ||
    (product?.customFit?.value && !product.customFit.value.startsWith("gid://")
      ? product.customFit.value
      : null) ||
    (product?.shopifyFit?.value && !product.shopifyFit.value.startsWith("gid://")
      ? product.shopifyFit.value
      : null);

  const rawFabric =
    product?.fitFabricDetails?.fabric ||
    (product?.customFabric?.value && !product.customFabric.value.startsWith("gid://")
      ? product.customFabric.value
      : null) ||
    (product?.shopifyFabric?.value && !product.shopifyFabric.value.startsWith("gid://")
      ? product.shopifyFabric.value
      : null);

  const rawStretch =
    product?.fitFabricDetails?.stretch ||
    product?.customStretch?.value ||
    product?.shopifyStretch?.value;

  const rawLining =
    product?.fitFabricDetails?.lining ||
    product?.customLining?.value ||
    product?.shopifyLining?.value;

  // 2. Specific product preset
  const matchedPresetKey = Object.keys(PRODUCT_FIT_FABRIC_MAP).find(
    (k) => handle.includes(k) || title.includes(k)
  );
  const preset = matchedPresetKey ? PRODUCT_FIT_FABRIC_MAP[matchedPresetKey] : null;

  return {
    fit: formatFitFabricValue("fit", rawFit) || preset?.fit || "Fitted",
    fabric: formatFitFabricValue("fabric", rawFabric) || preset?.fabric || "100% Cotton",
    stretch: formatFitFabricValue("stretch", rawStretch) || preset?.stretch || "Non-stretch",
    lining: formatFitFabricValue("lining", rawLining) || preset?.lining || "Yes",
  };
};
