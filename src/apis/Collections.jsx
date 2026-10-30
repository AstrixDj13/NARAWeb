import api from "../utils/interceptors";

export async function getCollections() {
  const query = `{
  collections(first: 100) {
    edges {
      node {
        id
        title
        image {
          url
        }
        mobileBanner: metafield(namespace: "custom", key: "mobile_banner") {
          reference {
            ... on MediaImage {
              image {
                url
              }
            }
          }
        }
      }
    }
  }
}
`;

  try {
    const response = await api.post("", {
      query,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors
        .map((error) => error.message)
        .join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const collectionsData = response.data.data?.collections;
    if (!collectionsData) {
      throw new Error("No collections data found");
    }
    const collections = collectionsData.edges.map(el => {
      const mobileImage = el.node.mobileBanner?.reference?.image?.url || null;
      return { 
        title: el.node.title, 
        id: el.node.id, 
        imageSrc: el.node.image?.url,
        mobileImageSrc: mobileImage
      };
    });
    return collections;
  } catch (error) {
    console.error("Could not fetch collections:", error.message);
    throw error;
  }
}

export async function getCollectionById(collectionId) {
  const formattedId = collectionId.includes("gid://") ? collectionId : `gid://shopify/Collection/${collectionId}`;
  const query = `{
  collection(id: "${formattedId}") {
    descriptionHtml
    title
    products(first: 100) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          totalInventory
          metafield(namespace: "custom", key: "stock_quantity") {
            value
          }
          variants(first: 20) {
            edges {
              node {
                title
                image {
                  url
                }
                price {
                  amount
                  currencyCode
                }
                id
                availableForSale
                quantityAvailable
              }
            }
          }
        }
      }
    }
  }
}`;

  const variables = { id: collectionId };

  try {
    const response = await api.post("", {
      query,
    });

    if (response.data.errors) {
      const errorMessages = response.data.errors
        .map((error) => error.message)
        .join(", ");
      throw new Error(`GraphQL error(s): ${errorMessages}`);
    }

    const collectionData = response.data.data?.collection;
    if (!collectionData) {
      throw new Error("No collection data found");
    }

    const collectionDetail = {
      title: collectionData.title,
      descriptionHtml: collectionData.descriptionHtml,
    };

    const products = collectionData.products.edges.map((product) => {
      const node = product.node;
      const firstVariantNode = node.variants?.edges?.[0]?.node;

      const variants = (node.variants?.edges || []).map((v) => ({
        id: v.node.id,
        title: v.node.title,
        price: v.node.price?.amount,
        availableForSale: v.node.availableForSale,
        quantityAvailable: v.node.quantityAvailable,
      }));

      // A product is out of stock if:
      // 1. availableForSale is explicitly false on the product
      // 2. totalInventory is known and <= 0
      // 3. all variants are unavailable or 0 quantity
      // 4. custom stock_quantity metafield says 0 / sold out / out of stock
      const hasInStockVariant =
        variants.length === 0 ||
        variants.some((v) => {
          if (v.availableForSale === false) return false;
          if (v.quantityAvailable !== undefined && v.quantityAvailable !== null) {
            return Number(v.quantityAvailable) > 0;
          }
          return v.availableForSale === true;
        });

      const stockLeftVal = node.metafield?.value ?? undefined;
      const stockStr = (stockLeftVal ?? "").toString().trim().toLowerCase();
      const isMetafieldOutOfStock =
        stockStr === "0" || stockStr === "out of stock" || stockStr === "sold out";

      const isOutOfStock =
        node.availableForSale === false ||
        (node.totalInventory !== undefined &&
          node.totalInventory !== null &&
          Number(node.totalInventory) <= 0) ||
        !hasInStockVariant ||
        isMetafieldOutOfStock;

      return {
        title: node.title,
        handle: node.handle,
        imageSrc: firstVariantNode?.image?.url,
        price: firstVariantNode?.price?.amount,
        productId: node.id,
        variantId: firstVariantNode?.id,
        variants,
        stockLeft: stockLeftVal,
        availableForSale: !isOutOfStock,
        totalInventory: node.totalInventory,
        isOutOfStock,
      };
    });

    // Partition: In-stock products display first, all out-of-stock products display at the end
    const inStock = products.filter((p) => !p.isOutOfStock);
    const outOfStock = products.filter((p) => p.isOutOfStock);
    const sortedProducts = [...inStock, ...outOfStock];

    return { collectionDetail, products: sortedProducts };
  } catch (error) {
    console.error("Could not fetch collection items:", error.message);
    throw error;
  }
}
