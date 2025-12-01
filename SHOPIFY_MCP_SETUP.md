# Shopify Storefront MCP Integration Guide

This guide explains how to use the **Official Shopify Storefront MCP Server** with your chatbot.

## Overview

The chatbot has been enhanced to integrate with Shopify's **Official Storefront MCP Server** - a production-ready API endpoint built into every Shopify store at `https://{storedomain}/api/mcp`. 

**Key Feature:** Claude (the LLM) has direct access to MCP tools and decides when to use them. This is the proper agentic architecture:

1. **Tool Discovery**: On startup, the chatbot discovers available tools from the Shopify MCP Server
2. **Tool Registration**: MCP tools are converted to Claude's function calling format
3. **Agentic Behavior**: Claude decides when to call tools based on user queries
4. **Tool Execution**: When Claude requests a tool, the frontend executes it via MCP
5. **Response Generation**: Claude uses tool results to generate accurate responses

**Reference:** [Shopify Storefront MCP Server Guide](https://skywork.ai/skypage/en/shopify-storefront-ai-guide/1978666344409321472)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install the new dependencies:
- `express` - Backend server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `concurrently` - Run frontend and backend together

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Update the following variables in `.env`:

- `VITE_ANTHROPIC_API_KEY` - Your Anthropic API key for Claude
- `VITE_SHOPIFY_STORE_DOMAIN` - Your Shopify store domain (e.g., `72cbc9-6d.myshopify.com`)
- `VITE_STOREFRONT_ACCESS_TOKEN` - (Optional) Fallback Storefront API token if MCP is unavailable

**Note:** The Shopify Storefront MCP Server is built into every Shopify store and doesn't require authentication for public data. The endpoint is automatically available at `https://{storedomain}/api/mcp`.

### 3. Running the Application

Simply run the frontend:

```bash
npm run dev
```

**No backend server needed!** The chatbot connects directly to Shopify's MCP Server endpoint at `https://{your-store-domain}/api/mcp`.

### 4. Testing the Integration

1. Start the application using one of the methods above
2. Open your website in the browser
3. Click on the chatbot icon (bottom right)
4. Try asking questions like:
   - "Show me products"
   - "What products do you have?"
   - "Search for [product name]"
   - "What's the price of [product]?"

## How It Works

### Query Detection

The chatbot automatically detects Shopify-related queries using keyword matching:
- **Product queries**: "product", "item", "buy", "price", "shop", "purchase", "catalog", etc.
- **Order queries**: "order", "purchase history", "my orders", etc.
- **Customer queries**: "account", "profile", "my account", etc.

### How It Works: MCP Protocol

The chatbot uses the **Model Context Protocol (MCP)** to communicate with Shopify's Storefront MCP Server:

1. **MCP Endpoint**: `https://{storedomain}/api/mcp`
2. **Protocol**: JSON-RPC 2.0 format
3. **Tool**: `search_shop_catalog` - Searches the store's product catalog

### Data Flow (Agentic Architecture)

1. **On Startup**: Chatbot discovers available MCP tools from `https://{storedomain}/api/mcp`
2. **Tool Conversion**: MCP tools are converted to Claude function format
3. **User Query**: User asks a question in the chatbot
4. **Claude Decision**: Claude receives the query and available tools, decides if tools are needed
5. **Tool Call**: If needed, Claude requests tool calls (e.g., `search_shop_catalog`)
6. **Tool Execution**: Frontend executes the tool call via MCP protocol
7. **Result Return**: Tool results are sent back to Claude
8. **Response Generation**: Claude uses tool results to generate the final response

### MCP Protocol

**Tool Discovery:**
```json
{
  "jsonrpc": "2.0",
  "id": 1234567890,
  "method": "tools/list",
  "params": {}
}
```

**Tool Execution:**
```json
{
  "jsonrpc": "2.0",
  "id": 1234567890,
  "method": "tools/call",
  "params": {
    "name": "search_shop_catalog",
    "arguments": {
      "query": "search term",
      "limit": 5
    }
  }
}
```

### Claude Tool Integration

Claude receives tools in this format:
```json
{
  "name": "search_shop_catalog",
  "description": "Search the store's product catalog",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" },
      "limit": { "type": "number" }
    }
  }
}
```

## Customization

### Adding More Query Types

Edit `src/components/Chatbot.jsx` and update the `detectShopifyQuery` function to add more keywords or query types.

### Extending Backend Functionality

Edit `server/index.js` to:
- Add more Shopify API endpoints
- Integrate with actual MCP server (if you have one configured)
- Add caching for better performance
- Add authentication/rate limiting

### Styling

The chatbot styles are in `src/components/Chatbot.css`. Customize as needed.

## Troubleshooting

### Backend Not Connecting

- Make sure the backend server is running on port 3001
- Check that `VITE_API_BASE_URL` in `.env` matches your backend URL
- Check browser console for CORS errors

### No Product Results

- Verify your Shopify Storefront API token is correct
- Check that your Shopify store URL is correct
- Ensure products exist in your Shopify store

### Claude API Errors

- Verify your Anthropic API key is set correctly
- Check that you have API credits available
- Review the error message in the chatbot

## Production Deployment

For production:

1. Set environment variables in your hosting platform
2. Deploy the backend server separately (or use serverless functions)
3. Update `VITE_API_BASE_URL` to point to your production backend
4. Ensure CORS is configured correctly for your domain

## Next Steps

To fully integrate with Shopify MCP tools (if you have an MCP server):

1. Configure your MCP server connection in `server/index.js`
2. Replace the Shopify Storefront API calls with MCP tool calls
3. Use the available MCP functions:
   - `mcp_shopify_get-products`
   - `mcp_shopify_get-product-by-id`
   - `mcp_shopify_get-orders`
   - `mcp_shopify_get-customers`
   - etc.

## Support

For issues or questions, check:
- Shopify Storefront API documentation
- Anthropic Claude API documentation
- MCP (Model Context Protocol) documentation

