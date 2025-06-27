import api from "../utils/interceptors"; 

const GET_ALL_PRODUCTS_QUERY = `
 {
  products(first: 200) {
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