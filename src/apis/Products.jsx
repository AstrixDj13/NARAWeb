import api from "../utils/interceptors";
import { isAdaaCollectionTitle } from "../constants/sizeGuides";


const parseMetafieldVal = (raw) => {
  if (!raw) return null;

  // 1. Single Metaobject reference
  if (raw.reference && typeof raw.reference === "object") {
    if (raw.reference.fields && Array.isArray(raw.reference.fields)) {
      const labelField = raw.reference.fields.find(
        (f) => f.key === "label" || f.key === "name" || f.key === "value"
      );
      if (labelField?.value && !labelField.value.startsWith("gid://")) return labelField.value;
    }
    if (raw.reference.handle && !raw.reference.handle.startsWith("gid://")) {
      // Capitalize handle if simple word like "wide" -> "Wide"
      const h = raw.reference.handle;
      return h.charAt(0).toUpperCase() + h.slice(1);
    }
  }

  // 2. List of Metaobject references
  if (raw.references?.nodes && Array.isArray(raw.references.nodes)) {
    const labels = raw.references.nodes
      .map((node) => {
        const labelField = node.fields?.find(
          (f) => f.key === "label" || f.key === "name" || f.key === "value"
        );
        if (labelField?.value && !labelField.value.startsWith("gid://")) return labelField.value;
        if (node.handle && !node.handle.startsWith("gid://")) {
          return node.handle.charAt(0).toUpperCase() + node.handle.slice(1);
        }
        return null;
      })
      .filter(Boolean);
    if (labels.length > 0) return labels.join(", ");
  }

  // 3. String value
  let val = typeof raw === "object" && raw.value !== undefined ? raw.value : raw;
  if (!val || typeof val !== "string") return null;
  val = val.trim();

  // If JSON array or object
  if ((val.startsWith("[") && val.endsWith("]")) || (val.startsWith("{") && val.endsWith("}"))) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        const nonGids = parsed.filter(
          (item) => typeof item === "string" && !item.startsWith("gid://")
        );
        if (nonGids.length > 0) return nonGids.join(", ");
      } else if (typeof parsed === "object" && parsed !== null) {
        const candidate = parsed.label || parsed.value || parsed.name;
        if (candidate && !String(candidate).startsWith("gid://")) return candidate;
      }
    } catch {}
  }

  // If the raw string is a GID, return null so fallbacks work
  if (val.startsWith("gid://")) {
    return null;
  }

  return val;
};

export async function getProductById(productId) {
  const formattedId = productId.includes("gid://") ? productId : `gid://shopify/Product/${productId}`;
  const query = `
query getProductById($id: ID!) {
  product(id: $id) {
    id
    title
    handle
    descriptionHtml
    images(first: 250) {
      edges {
        node {
          src
          altText
          width
          height
        }
      }
    }
    options {
      name
      optionValues {
        swatch {
          color
          image {
            mediaContentType
            previewImage {
              url
            }
          }
        }
        name
      }
      values
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          quantityAvailable
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            src
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    worthMetafield: metafield(namespace: "custom", key: "worth") {
      value
    }
    shopifyFit: metafield(namespace: "shopify", key: "fit") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
      references(first: 5) {
        nodes {
          ... on Metaobject {
            id
            handle
            fields {
              key
              value
            }
          }
        }
      }
    }
    shopifyFabric: metafield(namespace: "shopify", key: "fabric") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
      references(first: 5) {
        nodes {
          ... on Metaobject {
            id
            handle
            fields {
              key
              value
            }
          }
        }
      }
    }
    shopifyStretch: metafield(namespace: "shopify", key: "stretch") { value }
    shopifyLining: metafield(namespace: "shopify", key: "lining") { value }
    customFit: metafield(namespace: "custom", key: "fit") { value }
    customFabric: metafield(namespace: "custom", key: "fabric") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
      references(first: 5) {
        nodes {
          ... on Metaobject {
            id
            handle
            fields {
              key
              value
            }
          }
        }
      }
    }
    customStretch: metafield(namespace: "custom", key: "stretch") { value }
    customLining: metafield(namespace: "custom", key: "lining") { value }
    collections(first: 10) {  # Fetch all the collection ID
        edges {
          node {
            id
            title
        }
      }
    }
  }
}


  `;

  const variables = { id: formattedId };

  try {
    const response = await api.post("", {
      query,
      variables,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors.map((error) => error.message).join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const productData = response.data.data?.product;
    if (!productData) {
      throw new Error("No product data found");
    }

    // Check if the product has only one variant
    const variants = productData.variants.edges;

    console.log("logging products variants: ", variants);

    // add sizes 
    const sizes = productData.options.filter(el => el.name === "Size")[0]?.values;
    if (sizes) {
      productData.sizesAvailable = true;
      const allSizes = new Set(['S', 'L', 'XL', 'M', '3XS', '2XL']);
      const availableSizes = new Set(sizes);
      productData.disabledSizes = Array.from(allSizes.difference(availableSizes));
      productData.availableSizes = Array.from(availableSizes);
    } else {
      productData.sizesAvailable = false;
    }

    // query for the variant with the lowest price

    if (variants.length === 1) {
      productData.price = variants[0].node.price;
    } else {
      const lowestPricedVariant = variants.reduce((prev, current) =>
        +current.node.price.amount < +prev.node.price.amount ? current : prev
      );

      console.log("lowest priced variant", lowestPricedVariant);
      const selectedOptions = lowestPricedVariant.node.selectedOptions;
      const sizeObject = selectedOptions.find(el => el.name === "Size");
      const colorObject = selectedOptions.find(el => el.name === "Color");

      productData.defaultSize = sizeObject?.value || false;
      productData.defaultColor = colorObject?.value.toLowerCase() || false;

      console.log("default size: ", productData.defaultSize);
      console.log("default color", productData.defaultColor);

    }

    // set default colors:
    // colorOptions.map(el=> ({name:el.name, value: el.swatch.color, image: el.swatch.image?.previewImage?.url}))

    // Extract and attach the colors array:
    const colorsArray = productData.options.find(el => el.name == "Color")?.optionValues.map(el => ({ name: el.name, value: el.swatch.color, image: el.swatch.image?.previewImage?.url }));
    productData.colorsArray = colorsArray;
    // Extract the collection ID
    //const collectionId = productData.collections.edges[0]?.node.id;
    //productData.collectionId = collectionId;

    // Extract all collections
    const collections = productData.collections.edges.map((edge) => edge.node);

    // 1. Prioritize ADAA collection if product belongs to ADAA (ADAA products show ADAA related products only)
    let concernedCollection = collections.find((collection) =>
      isAdaaCollectionTitle(collection.title)
    );

    // 2. Identify the concerned collection (prioritize LAYA second)
    if (!concernedCollection) {
      concernedCollection = collections.find((collection) => collection.title === "LAYA - The Work Edit");
    }

    if (!concernedCollection) {
      concernedCollection = collections.find((collection) =>
        ["Tops", "Bottoms", "Co-ord sets", "Saaz: The Festive Collection"].includes(collection.title)
      );
    }

    if (!concernedCollection && collections.length > 0) {
      concernedCollection = collections[0];
    }

    // Set the concerned collection ID
    productData.concernedCollectionId = concernedCollection?.id;

    productData.worth = productData.worthMetafield?.value || null;

    productData.fitFabricDetails = {
      fit: parseMetafieldVal(productData.customFit) || parseMetafieldVal(productData.shopifyFit) || null,
      fabric: parseMetafieldVal(productData.customFabric) || parseMetafieldVal(productData.shopifyFabric) || null,
      stretch: parseMetafieldVal(productData.customStretch) || parseMetafieldVal(productData.shopifyStretch) || null,
      lining: parseMetafieldVal(productData.customLining) || parseMetafieldVal(productData.shopifyLining) || null,
    };

    console.log("logging the complete product data, ", productData);
    return productData;
  } catch (error) {
    console.error("Could not fetch product info:", error.message);
    throw error;
  }
}

export async function getProductByHandle(handle) {
  const query = `
query getProductByHandle($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    handle
    descriptionHtml
    images(first: 250) {
      edges {
        node {
          src
          altText
          width
          height
        }
      }
    }
    options {
      name
      optionValues {
        swatch {
          color
          image {
            mediaContentType
            previewImage {
              url
            }
          }
        }
        name
      }
      values
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          quantityAvailable
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            src
          }
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    worthMetafield: metafield(namespace: "custom", key: "worth") {
      value
    }
    shopifyFit: metafield(namespace: "shopify", key: "fit") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
      references(first: 5) {
        nodes {
          ... on Metaobject {
            id
            handle
            fields {
              key
              value
            }
          }
        }
      }
    }
    shopifyFabric: metafield(namespace: "shopify", key: "fabric") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
      references(first: 5) {
        nodes {
          ... on Metaobject {
            id
            handle
            fields {
              key
              value
            }
          }
        }
      }
    }
    shopifyStretch: metafield(namespace: "shopify", key: "stretch") { value }
    shopifyLining: metafield(namespace: "shopify", key: "lining") { value }
    customFit: metafield(namespace: "custom", key: "fit") { value }
    customFabric: metafield(namespace: "custom", key: "fabric") {
      value
      reference {
        ... on Metaobject {
          id
          handle
          fields {
            key
            value
          }
        }
      }
      references(first: 5) {
        nodes {
          ... on Metaobject {
            id
            handle
            fields {
              key
              value
            }
          }
        }
      }
    }
    customStretch: metafield(namespace: "custom", key: "stretch") { value }
    customLining: metafield(namespace: "custom", key: "lining") { value }
    collections(first: 10) {  # Fetch all the collection ID
        edges {
          node {
            id
            title
        }
      }
    }
  }
}
  `;

  const variables = { handle };

  try {
    const response = await api.post("", {
      query,
      variables,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors.map((error) => error.message).join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const productData = response.data.data?.productByHandle;
    if (!productData) {
      throw new Error("No product data found");
    }

    // Reuse the same logic for processing product data as getProductById
    // Ideally this should be a shared helper function, but duplicating for now to minimize refactor risk

    // Check if the product has only one variant
    const variants = productData.variants.edges;

    console.log("logging products variants: ", variants);

    // add sizes 
    const sizes = productData.options.filter(el => el.name === "Size")[0]?.values;
    if (sizes) {
      productData.sizesAvailable = true;
      const allSizes = new Set(['S', 'L', 'XL', 'M', '3XS', '2XL']);
      const availableSizes = new Set(sizes);
      productData.disabledSizes = Array.from(allSizes.difference(availableSizes));
      productData.availableSizes = Array.from(availableSizes);
    } else {
      productData.sizesAvailable = false;
    }

    // query for the variant with the lowest price

    if (variants.length === 1) {
      productData.price = variants[0].node.price;
    } else {
      const lowestPricedVariant = variants.reduce((prev, current) =>
        +current.node.price.amount < +prev.node.price.amount ? current : prev
      );

      console.log("lowest priced variant", lowestPricedVariant);
      const selectedOptions = lowestPricedVariant.node.selectedOptions;
      const sizeObject = selectedOptions.find(el => el.name === "Size");
      const colorObject = selectedOptions.find(el => el.name === "Color");

      productData.defaultSize = sizeObject?.value || false;
      productData.defaultColor = colorObject?.value.toLowerCase() || false;

      console.log("default size: ", productData.defaultSize);
      console.log("default color", productData.defaultColor);

    }

    // Extract and attach the colors array:
    const colorsArray = productData.options.find(el => el.name == "Color")?.optionValues.map(el => ({ name: el.name, value: el.swatch.color, image: el.swatch.image?.previewImage?.url }));
    productData.colorsArray = colorsArray;

    // Extract all collections
    const collections = productData.collections.edges.map((edge) => edge.node);

    // 1. Prioritize ADAA collection if product belongs to ADAA (ADAA products show ADAA related products only)
    let concernedCollection = collections.find((collection) =>
      isAdaaCollectionTitle(collection.title)
    );

    // 2. Identify the concerned collection (prioritize LAYA second)
    if (!concernedCollection) {
      concernedCollection = collections.find((collection) => collection.title === "LAYA - The Work Edit");
    }

    if (!concernedCollection) {
      concernedCollection = collections.find((collection) =>
        ["Tops", "Bottoms", "Co-ord sets", "Saaz: The Festive Collection"].includes(collection.title)
      );
    }

    if (!concernedCollection && collections.length > 0) {
      concernedCollection = collections[0];
    }

    // Set the concerned collection ID
    productData.concernedCollectionId = concernedCollection?.id;

    productData.worth = productData.worthMetafield?.value || null;

    productData.fitFabricDetails = {
      fit: parseMetafieldVal(productData.customFit) || parseMetafieldVal(productData.shopifyFit) || null,
      fabric: parseMetafieldVal(productData.customFabric) || parseMetafieldVal(productData.shopifyFabric) || null,
      stretch: parseMetafieldVal(productData.customStretch) || parseMetafieldVal(productData.shopifyStretch) || null,
      lining: parseMetafieldVal(productData.customLining) || parseMetafieldVal(productData.shopifyLining) || null,
    };

    console.log("logging the complete product data (by handle), ", productData);
    return productData;
  } catch (error) {
    console.error("Could not fetch product info by handle:", error.message);
    throw error;
  }
}

//src: url(transform: {maxWidth: 800, preferredContentType: WEBP})
//url: url(transform: {maxWidth: 800, preferredContentType: WEBP})
//for Product.jsx, Collections.jsx and getAllProducts.jsx

export async function getProductVariantDetail(variantId) {
  const formattedId = variantId.includes("gid://") ? variantId : `gid://shopify/ProductVariant/${variantId}`;
  const query = `
    query getProductVariantById($id: ID!) {
      node(id: $id) {
        ... on ProductVariant {
          id
         
          image {
            src
            altText
          }
          priceV2 {
            amount
            currencyCode
          }
          product {
            id
            title
          }
          selectedOptions {
            name
            value
          }
          title
        }
      }
    }
  `;

  const variables = { id: formattedId };

  try {
    const response = await api.post("", {
      query,
      variables,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors.map((error) => error.message).join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const productData = response.data.data?.node;
    if (!productData) {
      throw new Error("No product variant data found");
    }

    return productData;
  } catch (error) {
    console.error("Could not fetch product variant info:", error.message);
    throw error;
  }
}


export async function searchProductsAPI(searchTerm) {
  const query = `
  {
  search(query: "${searchTerm}", first: 100) {
    edges {
      node {
        ... on Product {
          id
          title
          handle
          variants(first: 1) {
          nodes {
            id
            image {
              src
            }
            price {
              amount
              currencyCode
            }
          }
        }
        }
      }
    }
  }
}
`


  try {
    const response = await api.post('/', {
      query
    });


    const products = response.data.data.search.edges.map(edge => edge.node);

    console.log("logging from the search thingy: ", products);

    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }

};




//here




export const fetchFourProducts = async () => {
  const GET_FOUR_PRODUCTS_QUERY = `
 {
  products(first: 4) {
    edges {
      node {
        id
        title
        handle
        variants(first: 1) {
          nodes {
            id
            image {
              src
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
}

`;
  try {

    const response = await api.post('/', {
      query: GET_FOUR_PRODUCTS_QUERY,
    });
    const products = response.data.data.products.edges.map(edge => edge.node);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchSixProductsfromCol = async (collectionId, productId) => {
  if (!collectionId) return [];
  const formattedId = collectionId.includes("gid://")
    ? collectionId
    : `gid://shopify/Collection/${collectionId}`;

  const GET_FOUR_PRODUCTS_QUERY = `
    query getProductsByCollection($collectionId: ID!) {
      collection(id: $collectionId) {
        products(first: 20) { # Fetch more products to ensure we can exclude the selected one
          edges {
            node {
              id
              title
              handle
              metafield(namespace: "custom", key: "stock_quantity") {
                value
              }
              variants(first: 1) {
                nodes {
                  id
                  image {
                    src
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const variables = { collectionId: formattedId };

  try {
    const response = await api.post("/", {
      query: GET_FOUR_PRODUCTS_QUERY,
      variables,
    });

    const productEdges = response.data?.data?.collection?.products?.edges || [];

    // Filter out the selected product and limit to 6 products
    const products = productEdges
      .map((edge) => edge.node)
      .filter((product) => product.id !== productId) // Exclude the selected product
      .slice(0, 6); // Limit to 6 products

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
