const fs = require('fs');
const content = fs.readFileSync('dist/assets/ProductsDetail-DgDybE73.js', 'utf8');
const lines = content.split('\n');
const line = lines[31];
console.log('Context:', line.substring(Math.max(0, 19039 - 100), Math.min(line.length, 19039 + 100)));
console.log('Error Char at 19039:', line.charAt(19039));
