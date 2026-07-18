import api from "../utils/interceptors";

const GET_ALL_PRODUCTS_QUERY = `
 {
  products(first: 200) {
    edges {
      node {
        id
        title
        handle
        images(first: 5) {
          nodes {
            url
          }
        }
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

`;

export const fetchProducts = async () => {
  try {
    const response = await api.post('/', {
      query: GET_ALL_PRODUCTS_QUERY,
    });
    const products = response.data.data.products.edges.map(edge => edge.node);
    console.log(products)
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductsBySize = async (size) => {
  const query = `
  {
    products(first: 250) {
      edges {
        node {
          id
          title
          handle
          images(first: 2) {
            nodes {
              url
            }
          }
          variants(first: 20) {
            nodes {
              id
              availableForSale
              selectedOptions {
                name
                value
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
    const response = await api.post('/', { query });
    const products = response.data.data.products.edges.map(edge => edge.node);
    
    // Filter products that have the specified size and are available
    const filteredProducts = products.filter(product => {
      return product.variants.nodes.some(variant => 
        variant.availableForSale && 
        variant.selectedOptions.some(opt => opt.name === 'Size' && opt.value.toUpperCase() === size.toUpperCase())
      );
    });
    
    return filteredProducts; // return all products that have this size available
  } catch (error) {
    console.error('Error fetching products by size:', error);
    return [];
  }
};