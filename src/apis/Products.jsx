import api from "../utils/interceptors";

export async function getProductById(productId) {
  const query = `
query getProductById($id: ID!) {
  product(id: $id) {
    id
    title
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
  }
}


  `;

  const variables = { id: productId };

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
    const sizes = productData.options.filter(el=>el.name==="Size")[0]?.values;
    if(sizes){
      productData.sizesAvailable = true;
      const allSizes = new Set(['S', 'L', 'XL', 'M', '3XS', '2XL']);
      const availableSizes = new Set(sizes);
      productData.disabledSizes = Array.from(allSizes.difference(availableSizes));
      productData.availableSizes = Array.from(availableSizes);
    }else{
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
      const sizeObject = selectedOptions.find(el=>el.name==="Size");
      const colorObject = selectedOptions.find(el=>el.name==="Color");
      
       productData.defaultSize = sizeObject?.value || false;
       productData.defaultColor = colorObject?.value.toLowerCase() || false;

       console.log("default size: ",  productData.defaultSize);
       console.log("default color", productData.defaultColor);
      
    }
    
    // set default colors:
    // colorOptions.map(el=> ({name:el.name, value: el.swatch.color, image: el.swatch.image?.previewImage?.url}))

    // Extract and attach the colors array:
    const colorsArray = productData.options.find(el=>el.name=="Color")?.optionValues.map(el=> ({name:el.name, value: el.swatch.color, image: el.swatch.image?.previewImage?.url}));
    productData.colorsArray = colorsArray;

    console.log("logging the complete product data, ", productData);
    return productData;
  } catch (error) {
    console.error("Could not fetch product info:", error.message);
    throw error;
  }
}



export async function getProductVariantDetail(variantId) {
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

  const variables = { id: variantId };

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


export async function searchProductsAPI(searchTerm){
  const query =`
  {
  search(query: "${searchTerm}", first: 100) {
    edges {
      node {
        ... on Product {
          id
        title
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