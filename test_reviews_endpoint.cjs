const fetch = require('node-fetch');

async function test() {
    try {
        const res = await fetch('http://localhost:3001/api/reviews?productId=gid://shopify/Product/9087622906070');
        const data = await res.json();
        console.log("Success! Data:", data);
    } catch (err) {
        console.log("Error:", err);
    }
}
test();
