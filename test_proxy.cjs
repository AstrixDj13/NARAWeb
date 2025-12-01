
const http = require('http');

const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'tools/list',
    id: 1
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/mcp-proxy?domain=72cbc9-6d.myshopify.com',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
