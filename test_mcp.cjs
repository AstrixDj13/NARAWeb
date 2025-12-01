
const https = require('https');

const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/list',
    id: 1
});

const options = {
    hostname: '72cbc9-6d.myshopify.com',
    port: 443,
    path: '/api/mcp',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Origin': 'http://localhost:5173' // Simulate browser origin
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
    process.exit(0);
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
