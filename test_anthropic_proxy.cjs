
const http = require('http');

const data = JSON.stringify({
    model: 'claude-sonnet-4-5',
    max_tokens: 10,
    messages: [{ role: 'user', content: 'Hello' }]
});

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/anthropic/messages',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        // Note: We need an API key here for the test to work, 
        // unless the server has it in .env. 
        // I'll assume the server has it or I'd need to pass it.
        // For this test, I'll pass a dummy one if env is missing, 
        // but the real test relies on the server having it or the client sending it.
        // Let's try sending one if we have it, otherwise rely on server.
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY || 'dummy-key-for-test'
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
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
