// Backend server for Shopify MCP integration
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BlobServiceClient } from '@azure/storage-blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React app
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Azure Storage Configuration
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME || 'nara-web-data';

let blobServiceClient;
let containerClient;

// In-Memory Data Stores
let newsletterData = [];
let reviewsData = [];

// Initialize Azure
if (AZURE_STORAGE_CONNECTION_STRING) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    containerClient = blobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);
    console.log(`Azure Blob Storage initialized. Container: ${AZURE_CONTAINER_NAME}`);

    // Create container if it doesn't exist
    containerClient.createIfNotExists().catch(err => console.error("Error creating container:", err.message));
  } catch (error) {
    console.error('Error initializing Azure Blob Storage:', error.message);
  }
} else {
  console.warn('AZURE_STORAGE_CONNECTION_STRING not found. Azure sync disabled.');
}

// Helper: Stream to Buffer
async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data));
    });
    readableStream.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    readableStream.on("error", reject);
  });
}

// Helper: Download from Azure
async function downloadFromAzure(blobName) {
  if (!containerClient) return null;
  try {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    if (await blobClient.exists()) {
      const downloadBlockBlobResponse = await blobClient.download(0);
      const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
      return JSON.parse(downloaded.toString());
    }
  } catch (error) {
    console.error(`Error downloading ${blobName} from Azure:`, error.message);
  }
  return null;
}

// Helper: Upload to Azure
async function uploadToAzure(blobName, data) {
  if (!containerClient) return;
  try {
    const blobClient = containerClient.getBlockBlobClient(blobName);
    const content = JSON.stringify(data, null, 2);
    await blobClient.upload(content, content.length);
    console.log(`Synced ${blobName} to Azure.`);
  } catch (error) {
    console.error(`Error uploading ${blobName} to Azure:`, error.message);
  }
}

// Initialize Data on Start
async function initializeData() {
  // Load Newsletter
  const azureNewsletter = await downloadFromAzure('newsletter_data.json');
  if (azureNewsletter) {
    newsletterData = azureNewsletter;
    console.log(`Loaded ${newsletterData.length} newsletter entries from Azure.`);
  } else {
    // Fallback to local file if exists (migration/dev)
    const localFile = path.join(__dirname, 'newsletter_data.json');
    if (fs.existsSync(localFile)) {
      try {
        newsletterData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        console.log(`Loaded ${newsletterData.length} newsletter entries from local file.`);
      } catch (e) { console.error("Error reading local newsletter file", e); }
    }
  }

  // Load Reviews
  const azureReviews = await downloadFromAzure('reviews_data.json');
  if (azureReviews) {
    reviewsData = azureReviews;
    console.log(`Loaded ${reviewsData.length} reviews from Azure.`);
  } else {
    // Fallback to local file
    const localFile = path.join(__dirname, 'reviews_data.json');
    if (fs.existsSync(localFile)) {
      try {
        reviewsData = JSON.parse(fs.readFileSync(localFile, 'utf8'));
        console.log(`Loaded ${reviewsData.length} reviews from local file.`);
      } catch (e) { console.error("Error reading local reviews file", e); }
    }
  }
}

initializeData();

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone number is required' });
    }

    const newEntry = {
      email,
      phone,
      timestamp: new Date().toISOString()
    };

    // Update Memory
    newsletterData.push(newEntry);

    // Sync to Azure (Background)
    uploadToAzure('newsletter_data.json', newsletterData);

    // Sync to Local (Backup/Dev)
    try {
      const dataFile = path.join(__dirname, 'newsletter_data.json');
      fs.writeFileSync(dataFile, JSON.stringify(newsletterData, null, 2));
    } catch (e) { console.error("Error writing local newsletter file", e); }

    res.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Error saving newsletter data:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Reviews Endpoints

// GET Reviews for a product
app.get('/api/reviews/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    // Filter reviews for this product
    const productReviews = reviewsData.filter(r => r.productId === productId);
    // Sort by date desc
    productReviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ reviews: productReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST Review
app.post('/api/reviews', (req, res) => {
  try {
    const { productId, userName, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({ error: 'Product ID and Rating are required' });
    }

    const newReview = {
      id: Date.now().toString(), // Simple ID
      productId,
      userName: userName || 'Anonymous',
      rating: Number(rating),
      comment,
      timestamp: new Date().toISOString()
    };

    // Update Memory
    reviewsData.push(newReview);

    // Sync to Azure (Background)
    uploadToAzure('reviews_data.json', reviewsData);

    // Sync to Local (Backup/Dev)
    try {
      const dataFile = path.join(__dirname, 'reviews_data.json');
      fs.writeFileSync(dataFile, JSON.stringify(reviewsData, null, 2));
    } catch (e) { console.error("Error writing local reviews file", e); }

    res.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ error: 'Failed to save review' });
  }
});

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

// Catch-all handler for any request that doesn't match the above
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Shopify MCP API server running on port ${PORT}`);
});

