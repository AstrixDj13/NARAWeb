import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, Settings, X, ShoppingCart, AlertCircle } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [shopifyDomain, setShopifyDomain] = useState('example.myshopify.com');
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_ANTHROPIC_API_KEY || '');
  const [cartId, setCartId] = useState(null);
  const [showArchitecture, setShowArchitecture] = useState(true);
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // MCP Tool definitions
  const getMCPTools = () => [
    {
      name: 'search_shop_catalog',
      description: 'Searches the store\'s product catalog to find items that match customer needs. Returns product name, price, currency, variant ID, product URL, image URL, and description.',
      input_schema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find related products'
          },
          context: {
            type: 'string',
            description: 'Additional information to help tailor results (e.g., customer preferences, current conversation context)'
          }
        },
        required: ['query', 'context']
      }
    },
    {
      name: 'search_shop_policies_and_faqs',
      description: 'Answers questions about the store\'s policies, products, and services to build customer trust. Use only the provided answer in responses.',
      input_schema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The question about policies or FAQs'
          },
          context: {
            type: 'string',
            description: 'Additional context like current product being viewed (optional)'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_cart',
      description: 'Retrieves the current contents of a cart, including item details and checkout URL.',
      input_schema: {
        type: 'object',
        properties: {
          cart_id: {
            type: 'string',
            description: 'ID of an existing cart (e.g., gid://shopify/Cart/abc123def456)'
          }
        },
        required: ['cart_id']
      }
    },
    {
      name: 'update_cart',
      description: 'Updates quantities of items in an existing cart or adds new items. Creates a new cart if no cart_id is provided. Set quantity to 0 to remove an item.',
      input_schema: {
        type: 'object',
        properties: {
          cart_id: {
            type: 'string',
            description: 'ID of the cart to update. Creates a new cart if not provided.'
          },
          add_items: {
            type: 'array',
            description: 'Array of items to add to the cart',
            items: {
              type: 'object',
              properties: {
                product_variant_id: {
                  type: 'string',
                  description: 'Global Product Variant ID (e.g., gid://shopify/ProductVariant/123456789) to add'
                },
                quantity: {
                  type: 'number',
                  description: 'Quantity to add'
                }
              },
              required: ['product_variant_id', 'quantity']
            }
          }
        },
        required: ['add_items']
      }
    }
  ];

  // Execute MCP tool calls via JSON-RPC 2.0 protocol
  const executeMCPTool = async (toolName, toolInput) => {
    const mcpEndpoint = `/api/mcp-proxy?domain=${shopifyDomain}`;

    console.log('🔌 Executing MCP Tool via Proxy:', {
      endpoint: mcpEndpoint,
      targetDomain: shopifyDomain,
      tool: toolName,
      input: toolInput
    });

    try {
      const jsonRpcRequest = {
        jsonrpc: '2.0',
        method: 'tools/call',
        id: Date.now(),
        params: {
          name: toolName,
          arguments: toolInput
        }
      };

      console.log('📤 Sending to MCP server:', jsonRpcRequest);

      const response = await fetch(mcpEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonRpcRequest)
      });

      if (!response.ok) {
        throw new Error(`MCP server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📥 MCP server response:', result);

      if (result.error) {
        throw new Error(result.error.message || 'MCP tool execution failed');
      }

      if (toolName === 'update_cart' && result.result?.cart_id) {
        setCartId(result.result.cart_id);
      }

      return result.result;
    } catch (error) {
      console.error('❌ MCP tool execution error:', error);
      return {
        error: true,
        message: `Failed to execute ${toolName}: ${error.message}`,
        details: 'Make sure your MCP server at ' + mcpEndpoint + ' is running and implements the ' + toolName + ' tool.',
        troubleshooting: [
          '1. Verify the MCP server URL is correct',
          '2. Check that the MCP server is running',
          '3. Ensure the server implements ' + toolName,
          '4. Check CORS settings if running locally',
          '5. View browser console for detailed logs'
        ]
      };
    }
  };

  // Main function to send messages to Claude
  const sendMessage = async (conversationHistory) => {
    try {
      const response = await fetch('/api/anthropic/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 4096,
          system: `You are a helpful shopping assistant for a Shopify store. You have access to tools to search products, answer policy questions, and manage shopping carts.

CRITICAL: The tools you have access to are:
1. search_shop_catalog - Use this to find products based on user queries
2. search_shop_policies_and_faqs - Use this to answer policy questions
3. get_cart - Use this to view cart contents (requires cart_id)
4. update_cart - Use this to add/update/remove items from cart

Important guidelines:
- When showing products, ALWAYS include the product image using Markdown format: ![Product Name](image_url)
- Create Markdown links for products using [Product Name](url) format
- Always provide meaningful context when searching to get better results
- Use only the information returned by search_shop_policies_and_faqs tool for policy questions
- When cart_id is available, use it for cart operations
- Be conversational and helpful
- If a tool returns an error, explain it clearly to the user

Current cart_id: ${cartId || 'none (will create new cart on first add)'}`,
          messages: conversationHistory,
          tools: getMCPTools()
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  };

  // Handle the conversation flow with tool calls
  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: 'Please set your Anthropic API Key in the settings (⚙️) to use the chatbot.'
      }]);
      setShowSettings(true);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const previousHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      let conversationHistory = [...previousHistory, { role: 'user', content: userMessage }];
      let continueLoop = true;
      let iterations = 0;
      const maxIterations = 10;

      while (continueLoop && iterations < maxIterations) {
        iterations++;
        console.log(`\n🔄 Iteration ${iterations}: Sending to Claude...`);

        const response = await sendMessage(conversationHistory);
        console.log('📨 Claude response:', response);

        const toolUseBlocks = response.content.filter(block => block.type === 'tool_use');

        if (toolUseBlocks.length > 0) {
          console.log(`🔧 Claude wants to use ${toolUseBlocks.length} tool(s):`,
            toolUseBlocks.map(t => t.name));

          conversationHistory.push({
            role: 'assistant',
            content: response.content
          });

          const toolResults = [];
          for (const toolUse of toolUseBlocks) {
            const toolName = toolUse.name;
            const toolDesc = toolName === 'search_shop_catalog' ? 'Searching products' :
              toolName === 'search_shop_policies_and_faqs' ? 'Looking up policies' :
                toolName === 'get_cart' ? 'Retrieving cart' :
                  toolName === 'update_cart' ? 'Updating cart' : 'Using tool';

            setMessages(prev => [...prev, {
              role: 'system',
              content: `🔧 ${toolDesc}: ${toolName}\n📝 Input: ${JSON.stringify(toolUse.input, null, 2)}`
            }]);

            const result = await executeMCPTool(toolUse.name, toolUse.input);

            toolResults.push({
              type: 'tool_result',
              tool_use_id: toolUse.id,
              content: JSON.stringify(result)
            });
          }

          conversationHistory.push({
            role: 'user',
            content: toolResults
          });

        } else {
          const textContent = response.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');

          setMessages(prev => {
            const withoutSystem = prev.filter(m => m.role !== 'system');
            return [...withoutSystem, {
              role: 'assistant',
              content: textContent
            }];
          });

          continueLoop = false;
        }
      }

      if (iterations >= maxIterations) {
        setMessages(prev => [...prev, {
          role: 'error',
          content: 'Maximum iteration limit reached. Please try again.'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'error',
        content: `Error: ${error.message}\n\nTroubleshooting:\n- Ensure Anthropic API is accessible\n- Check browser console for detailed logs\n- Verify MCP server is running at https://${shopifyDomain}/api/mcp`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Floating Widget UI
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Open Chat"
      >
        <div className="absolute -top-12 right-0 bg-white text-slate-800 px-4 py-2 rounded-xl shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us! 👋
        </div>
        <div className="text-3xl">💬</div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[450px] h-[80vh] md:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-10 duration-300">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">🤖</div>
          <div>
            <h1 className="font-bold text-slate-800">Shopify Assistant</h1>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {cartId && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-100">
              <ShoppingCart className="w-3 h-3" />
              Cart
            </div>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-slate-500"
            title="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Architecture Info Banner */}
      {showArchitecture && (
        <div className="bg-blue-600 text-white p-3 shrink-0 text-xs relative">
          <div className="flex gap-2 pr-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Dev Mode: MCP Active</p>
              <p className="text-blue-100 opacity-90">
                App → Proxy → MCP Server → Shopify
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowArchitecture(false)}
            className="absolute top-2 right-2 text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 p-6 animate-in fade-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800">Configuration</h3>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Shopify Store Domain
              </label>
              <input
                type="text"
                value={shopifyDomain}
                onChange={(e) => setShopifyDomain(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Anthropic API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-800">
              <p className="font-semibold mb-1">Status Check:</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                API Key {apiKey ? 'Set' : 'Missing'}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${shopifyDomain ? 'bg-green-500' : 'bg-red-500'}`}></div>
                Store Domain {shopifyDomain ? 'Set' : 'Missing'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10 px-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-3xl">
              🛍️
            </div>
            <h2 className="font-semibold text-slate-800 mb-1">Hi there! 👋</h2>
            <p className="text-sm mb-6">I can help you find products, check policies, or manage your cart.</p>

            <div className="grid gap-2">
              <button
                onClick={() => setInput('Show me some organic coffee')}
                className="p-3 bg-white rounded-xl text-sm hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all text-left flex items-center gap-3 group"
              >
                <span className="group-hover:scale-110 transition-transform">☕</span>
                Find products
              </button>
              <button
                onClick={() => setInput('What is your shipping policy?')}
                className="p-3 bg-white rounded-xl text-sm hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all text-left flex items-center gap-3 group"
              >
                <span className="group-hover:scale-110 transition-transform">🚚</span>
                Check shipping
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : msg.role === 'system'
                  ? 'bg-amber-50 text-amber-900 text-xs font-mono border border-amber-200 w-full'
                  : msg.role === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'
                }`}
            >
              <div
                className="prose prose-sm max-w-none whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full rounded-lg mt-2 mb-2 border border-slate-100" />')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 hover:underline font-medium">$1</a>')
                    .replace(/\n/g, '<br />')
                }}
              />
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-3 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;