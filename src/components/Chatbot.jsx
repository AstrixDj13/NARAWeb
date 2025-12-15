import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Loader2, X, ShoppingCart, AlertCircle } from 'lucide-react';
import { fixCheckoutUrl, gidToProductUrl } from "../utils/interceptors";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [shopifyDomain] = useState(import.meta.env.VITE_STORE_URL || 'example.myshopify.com');
  const [apiKey] = useState(import.meta.env.VITE_ANTHROPIC_API_KEY || '');
  const [cartId, setCartId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Draggable state
  const [position, setPosition] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 180 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef(null);
  const hasDragged = useRef(false);

  // Auto-greeting state
  const [greetingMessage, setGreetingMessage] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-greeting effect - shows messages when page loads
  useEffect(() => {
    const greetings = [
      "Hey! I am your personal AI shopper.",
      "Feel free to seek my assistance whenever needed"
    ];

    // Show first greeting after 1 second
    const firstTimer = setTimeout(() => {
      setGreetingMessage(greetings[0]);
      setShowGreeting(true);
    }, 1000);

    // Show second greeting after 3 seconds
    const secondTimer = setTimeout(() => {
      setGreetingMessage(greetings[1]);
    }, 3000);

    // Hide greeting after 10 seconds
    const hideTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 10000);

    return () => {
      clearTimeout(firstTimer);
      clearTimeout(secondTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Handle window resize to keep widget on screen
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: Math.min(prev.y, window.innerHeight - 60)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drag event handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.no-drag')) return; // Prevent dragging when clicking interactive elements
    setIsDragging(true);
    hasDragged.current = false;
    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      e.preventDefault();
      hasDragged.current = true;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Boundary checks
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 60)), // Simple boundary for now
        y: Math.max(0, Math.min(newY, window.innerHeight - 60))
      });
    }
  }, [isDragging, dragOffset, isOpen]);

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e) => {
    if (e.target.closest('.no-drag')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    hasDragged.current = false;
    const rect = dragRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleTouchMove = useCallback((e) => {
    if (isDragging) {
      hasDragged.current = true;
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;

      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 60)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 60))
      });
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove]);


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

      // Helper to apply fix
      const applyFix = (obj) => {
        if (!obj) return;
        if (obj.checkoutUrl) obj.checkoutUrl = fixCheckoutUrl(obj.checkoutUrl);
        if (obj.checkout_url) obj.checkout_url = fixCheckoutUrl(obj.checkout_url);
        if (obj.webUrl) obj.webUrl = fixCheckoutUrl(obj.webUrl);
      };

      if (result.result) {
        console.log('🔍 Raw Tool Result:', JSON.stringify(result.result, null, 2));

        applyFix(result.result);
        if (result.result.cart) applyFix(result.result.cart);
        console.log('✅ Fixed Tool Result:', JSON.stringify(result.result, null, 2));
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
- Create Markdown links for products using [Product Name](url) format. YOU MUST USE THE product_id PROVIDED IN THE TOOL RESULT TO CONSTRUCT THE URL. The URL format is: https://narawear.com/product/{encoded_product_id}. IMPORTANT: You must URL-encode the product_id (replace ':' with '%3A', '/' with '%2F'). Example: gid://shopify/Product/123 -> https://narawear.com/product/gid%3A%2F%2Fshopify%2FProduct%2F123
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
        content: 'API Key not configured. Please check VITE_ANTHROPIC_API_KEY in .env file.'
      }]);
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
          let textContent = response.content
            .filter(block => block.type === 'text')
            .map(block => block.text)
            .join('\n');

          // Apply URL fixes
          textContent = fixCheckoutUrl(textContent);

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
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }}
        className="z-50 group select-none"
      >
        <button
          onClick={(e) => {
            if (!isDragging && !hasDragged.current) {
              setIsOpen(true);
              setShowGreeting(false); // Hide greeting when chat opens
            }
          }}
          className="p-0 bg-transparent border-none outline-none transition-transform hover:scale-110"
          aria-label="Open Chat"
        >
          <div className="relative">
            <img
              src="/cat.gif"
              alt="Chat with us"
              draggable="false"
              className="w-40 h-40 object-contain drop-shadow-xl select-none"
            />
            {/* Auto-greeting speech bubble */}
            {showGreeting && greetingMessage && (
              <div
                className="absolute -top-16 right-0 bg-white text-slate-800 px-4 py-2.5 rounded-2xl shadow-lg text-sm font-medium pointer-events-none animate-bounce-slow"
                style={{
                  minWidth: '220px',
                  maxWidth: '280px',
                  animation: 'fadeInUp 0.3s ease-out'
                }}
              >
                <div className="relative">
                  {greetingMessage}
                  {/* Speech bubble tail */}
                  <div
                    className="absolute -bottom-2 right-8 w-0 h-0"
                    style={{
                      borderLeft: '8px solid transparent',
                      borderRight: '8px solid transparent',
                      borderTop: '8px solid white'
                    }}
                  />
                </div>
              </div>
            )}
            {/* Hover tooltip - only show when greeting is not visible */}
            {!showGreeting && (
              <div className="absolute -top-10 right-0 bg-white text-slate-800 px-3 py-1.5 rounded-xl shadow-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Chat with us! 👋
              </div>
            )}
          </div>
        </button>
      </div>
    );
  }

  // Calculate responsive dimensions for the chat window
  const getChatWindowStyle = () => {
    const isMobile = window.innerWidth < 640;
    const chatWidth = isMobile ? window.innerWidth - 16 : 380;
    const chatHeight = isMobile ? window.innerHeight - 100 : 500;

    // Ensure the chat window stays within viewport bounds
    const maxLeft = window.innerWidth - chatWidth - 8;
    const maxTop = window.innerHeight - chatHeight - 50;

    return {
      position: 'fixed',
      left: Math.min(Math.max(8, position.x), maxLeft),
      top: Math.min(Math.max(50, position.y), maxTop),
      width: chatWidth,
      height: chatHeight,
    };
  };

  return (
    <div
      ref={dragRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={getChatWindowStyle()}
      className="z-[9999] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in duration-300"
    >
      {/* Header - Draggable Area */}
      <div
        className="bg-green-900 shadow-sm border-b border-slate-200 p-4 flex justify-between items-center shrink-0 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-3 pointer-events-none">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
            <img src="/cat.gif" alt="Bot" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-[#facc15] text-sm">NARA AI Shopper</h1>
            <p className="text-[10px] text-[#facc14] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-2 no-drag" onMouseDown={e => e.stopPropagation()}>
          {cartId && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium border border-green-100">
              <ShoppingCart className="w-3 h-3" />
              Cart
            </div>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-[#facc15]"
            title="Close Chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-drag" onMouseDown={e => e.stopPropagation()}>
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-6 px-4">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3 text-2xl">
              <img src="/cat.gif" alt="Bot" className="w-8 h-8 object-contain" />
            </div>
            <h2 className="font-semibold text-slate-800 mb-1">Hi there! 👋</h2>
            <p className="text-xs mb-4">I can help you find products, check policies, or manage your cart.</p>

            <div className="grid gap-2">
              <button
                onClick={() => setInput('Show me some tops')}
                className="p-2.5 bg-white rounded-xl text-xs hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all text-left flex items-center gap-3 group"
              >
                <span className="group-hover:scale-110 transition-transform">☕</span>
                Find products
              </button>
              <button
                onClick={() => setInput('What is your shipping policy?')}
                className="p-2.5 bg-white rounded-xl text-xs hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all text-left flex items-center gap-3 group"
              >
                <span className="group-hover:scale-110 transition-transform">🚚</span>
                Check policies
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
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${msg.role === 'user'
                ? 'bg-green-900 rounded-br-none'
                : msg.role === 'system'
                  ? 'bg-amber-50 text-amber-900 text-xs font-mono border border-amber-200 w-full'
                  : msg.role === 'error'
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'
                }`}
              style={msg.role === 'user' ? { color: '#facc15' } : {}}
            >
              <div
                className="prose prose-sm max-w-none whitespace-pre-wrap break-words"
                style={msg.role === 'user' ? { color: '#facc15' } : {}}
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
            <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-none shadow-sm border border-slate-200">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-3 shrink-0 no-drag" onMouseDown={e => e.stopPropagation()}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="p-2 bg-green-900 text-[#facc15] rounded-xl hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;