// Backend server for Shopify MCP integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Shopify MCP API endpoints
// Note: These endpoints will proxy requests to Shopify MCP tools
// In production, you would configure MCP server connection here

app.post('/api/shopify/products', async (req, res) => {
  try {
    const { searchTitle, limit } = req.body;

    // This would call the MCP tool: mcp_shopify_get-products
    // For now, we'll use Shopify Storefront API as a fallback
    // In production, integrate with your MCP server

    const shopifyStore = process.env.SHOPIFY_STORE_URL || '72cbc9-6d.myshopify.com';
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_STOREFRONT_ACCESS_TOKEN;

    const query = `
      query getProducts($first: Int!, $query: String) {
        products(first: $first, query: $query) {
          edges {
            node {
              id
              title
              description
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      first: limit || 10,
      query: searchTitle ? `title:*${searchTitle}*` : undefined
    };

    const response = await fetch(`https://${shopifyStore}/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken
      },
      body: JSON.stringify({ query, variables })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors[0].message });
    }

    res.json({
      products: data.data.products.edges.map(edge => ({
        id: edge.node.id,
        title: edge.node.title,
        description: edge.node.description,
        handle: edge.node.handle,
        price: edge.node.priceRange.minVariantPrice.amount,
        currency: edge.node.priceRange.minVariantPrice.currencyCode,
        image: edge.node.images.edges[0]?.node.url
      }))
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/shopify/product/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const shopifyStore = process.env.SHOPIFY_STORE_URL || '72cbc9-6d.myshopify.com';
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_STOREFRONT_ACCESS_TOKEN;

    const query = `
      query getProduct($id: ID!) {
        product(id: $id) {
          id
          title
          description
          descriptionHtml
          handle
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
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${shopifyStore}/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken
      },
      body: JSON.stringify({ query, variables: { id } })
    });

    const data = await response.json();

    if (data.errors) {
      return res.status(400).json({ error: data.errors[0].message });
    }

    res.json({ product: data.data.product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/shopify/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    // This endpoint processes chatbot messages and uses Shopify data
    // It can call MCP tools or Shopify APIs based on the message intent

    // Detect if the message is about products
    const productKeywords = ['product', 'item', 'buy', 'price', 'shop', 'purchase', 'catalog'];
    const isProductQuery = productKeywords.some(keyword =>
      message.toLowerCase().includes(keyword)
    );

    let shopifyData = null;

    if (isProductQuery) {
      // Extract search term from message
      const searchMatch = message.match(/(?:search|find|show|get|list).*?(?:for|about|with)?\s+(.+?)(?:\?|$)/i);
      const searchTerm = searchMatch ? searchMatch[1].trim() : null;

      const shopifyStore = process.env.SHOPIFY_STORE_URL || '72cbc9-6d.myshopify.com';
      const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.VITE_STOREFRONT_ACCESS_TOKEN;

      const query = `
        query getProducts($first: Int!, $query: String) {
          products(first: $first, query: $query) {
            edges {
              node {
                id
                title
                description
                handle
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        first: 5,
        query: searchTerm ? `title:*${searchTerm}*` : undefined
      };

      const response = await fetch(`https://${shopifyStore}/api/2024-07/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': accessToken
        },
        body: JSON.stringify({ query, variables })
      });

      const data = await response.json();

      if (!data.errors && data.data) {
        shopifyData = {
          products: data.data.products.edges.map(edge => ({
            id: edge.node.id,
            title: edge.node.title,
            description: edge.node.description,
            price: edge.node.priceRange.minVariantPrice.amount,
            currency: edge.node.priceRange.minVariantPrice.currencyCode,
            image: edge.node.images.edges[0]?.node.url,
            handle: edge.node.handle
          }))
        };
      }
    }

    res.json({
      shopifyData,
      context: context || {}
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
});

// Proxy endpoint for Shopify MCP
app.post('/api/mcp-proxy', async (req, res) => {
  try {
    const { domain } = req.query;

    if (!domain) {
      return res.status(400).json({ error: 'Missing domain query parameter' });
    }

    const mcpEndpoint = `https://${domain}/api/mcp`;

    console.log('🔌 Proxying to MCP:', mcpEndpoint);
    console.log('📦 Payload:', JSON.stringify(req.body, null, 2));

    const response = await fetch(mcpEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other necessary headers here
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      console.error(`❌ MCP Error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: `MCP server error: ${response.statusText}`
      });
    }

    const data = await response.json();
    console.log('📥 MCP Response:', JSON.stringify(data, null, 2));

    res.json(data);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    res.status(500).json({
      error: `Proxy error: ${error.message}`,
      details: 'Check backend console for more info'
    });
  }
});

// Proxy endpoint for Anthropic API
app.post('/api/anthropic/messages', async (req, res) => {
  try {
    console.log('🤖 Proxying to Anthropic API');

    // Get API key from header or env var
    const apiKey = req.headers['x-api-key'] || process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res.status(401).json({ error: 'Missing Anthropic API Key' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Anthropic API Error: ${response.status} ${response.statusText}`, errorText);
      return res.status(response.status).json({
        error: `Anthropic API error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('❌ Anthropic Proxy Error:', error);
    res.status(500).json({ error: `Proxy error: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Shopify MCP API server running on port ${PORT}`);
});

