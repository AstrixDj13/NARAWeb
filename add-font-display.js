const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace standard font face blocks without font-display to include font-display: swap;
css = css.replace(/@font-face\s*{([^}]+)}/g, (match, innerProps) => {
    if (!innerProps.includes('font-display')) {
        return `@font-face {${innerProps}  font-display: swap;\n}`;
    }
    return match;
});

fs.writeFileSync(cssPath, css);
console.log("Added font-display: swap; to index.css");
