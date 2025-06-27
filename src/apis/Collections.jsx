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
    const collections = collectionsData.edges.map(el=>({title: el.node.title, id: el.node.id, imageSrc: el.node.image?.url}));
    return collections;
  } catch (error) {
    console.error("Could not fetch collections:", error.message);
    throw error;
  }
}

export async function getCollectionById(collectionId) {
  const query = `{
  collection(id: "${collectionId}") {
    descriptionHtml
    title
    products(first: 100) {
      edges {
        node {
          id
          title
          variants(first: 1) {
            edges {
              node {
                image {
                  url
                }
                price {
                  amount
                  currencyCode
                }
                id
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
    console.log(collectionData.products.edges);
    const products = collectionData.products.edges.map((product) => ({
      title: product.node.title,
      imageSrc: product.node.variants.edges[0].node.image?.url,
      price: product.node.variants.edges[0].node.price.amount,
      productId: product.node.id,
    }));

    return { collectionDetail, products };
  } catch (error) {
    console.error("Could not fetch collection items:", error.message);
    throw error;
  }
}