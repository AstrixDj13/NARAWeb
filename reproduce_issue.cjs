const http = require('http');

const PROXY_PORT = 3001;
const SHOP_DOMAIN = '72cbc9-6d.myshopify.com';

function callProxy(method, params) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: method,
                arguments: params
            },
            id: Date.now()
        });

        const options = {
            hostname: 'localhost',
            port: PROXY_PORT,
            path: `/api/mcp-proxy?domain=${SHOP_DOMAIN}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Status ${res.statusCode}: ${body}`));
                } else {
                    try {
                        const jsonResponse = JSON.parse(body);
                        if (jsonResponse.error) {
                            reject(new Error(jsonResponse.error.message));
                        } else {
                            resolve(jsonResponse.result);
                        }
                    } catch (e) {
                        reject(new Error(`Invalid JSON: ${body}`));
                    }
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function checkUrl(urlStr) {
    return new Promise((resolve) => {
        try {
            const url = new URL(urlStr);
            const req = require('https').request({
                hostname: url.hostname,
                path: url.pathname + url.search,
                method: 'GET'
            }, (res) => {
                resolve(res.statusCode);
            });
            req.on('error', () => resolve('ERROR'));
            req.end();
        } catch (e) {
            resolve('INVALID');
        }
    });
}

async function run() {
    try {
        console.log('🔍 Searching...');
        const searchResult = await callProxy('search_shop_catalog', {
            query: 'Viola Peplum Top',
            context: 'testing'
        });

        if (searchResult.content && searchResult.content.length > 0) {
            const textContent = searchResult.content[0].text;
            try {
                const data = JSON.parse(textContent);
                if (data.products && data.products.length > 0) {
                    const product = data.products[0];
                    let variantId = null;
                    if (product.variants && product.variants.length > 0) {
                        variantId = product.variants[0].variant_id;
                    }

                    if (variantId) {
                        console.log('🛒 Adding item to cart...');
                        const cartResult = await callProxy('update_cart', {
                            cart_id: undefined,
                            add_items: [{
                                product_variant_id: variantId,
                                quantity: 1
                            }]
                        });

                        if (cartResult.content && cartResult.content.length > 0) {
                            try {
                                const innerData = JSON.parse(cartResult.content[0].text);
                                if (innerData.cart) {
                                    const checkoutUrl = innerData.cart.checkout_url;
                                    console.log('🔗 Original Checkout URL:', checkoutUrl);

                                    if (checkoutUrl) {
                                        const status = await checkUrl(checkoutUrl);
                                        console.log(`📊 Original URL Status: ${status}`);

                                        // Test with shop domain
                                        const urlObj = new URL(checkoutUrl);
                                        const altUrl = checkoutUrl.replace(urlObj.hostname, SHOP_DOMAIN);
                                        console.log('🔗 Alternate Checkout URL:', altUrl);
                                        const altStatus = await checkUrl(altUrl);
                                        console.log(`📊 Alternate URL Status: ${altStatus}`);

                                        // Test Permalink
                                        const numericId = variantId.split('/').pop();
                                        const permalink = `https://${SHOP_DOMAIN}/cart/${numericId}:1`;
                                        console.log('🔗 Permalink URL:', permalink);
                                        const permalinkStatus = await checkUrl(permalink);
                                        console.log(`📊 Permalink Status: ${permalinkStatus}`);

                                        const permalinkOriginal = `https://${urlObj.hostname}/cart/${numericId}:1`;
                                        console.log('🔗 Permalink Original Domain:', permalinkOriginal);
                                        const permalinkOriginalStatus = await checkUrl(permalinkOriginal);
                                        console.log(`📊 Permalink Original Status: ${permalinkOriginalStatus}`);
                                    }
                                } else {
                                    console.log('⚠️ No cart object in inner JSON');
                                }
                            } catch (e) {
                                console.log('⚠️ Could not parse inner JSON:', e.message);
                            }
                        } else {
                            console.log('⚠️ No content in cart result:', JSON.stringify(cartResult, null, 2));
                        }
                    } else {
                        console.log('❌ No variant ID found');
                    }
                }
            } catch (e) {
                console.log('⚠️ Error parsing search result:', e.message);
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

run();
