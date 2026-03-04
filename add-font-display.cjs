const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/@font-face\s*{([^}]+)}/g, (match, innerProps) => {
    let result = innerProps;
    if (!result.includes('font-display')) {
        result = `${result}  font-display: swap;\n`;
    }
    if (!result.includes('size-adjust')) {
        result = `${result}  size-adjust: 100%;\n  ascent-override: normal;\n  descent-override: normal;\n  line-gap-override: normal;\n`;
    }
    return `@font-face {${result}}`;
});

fs.writeFileSync(cssPath, css);
console.log("Added font-display: swap and metrics to index.css");
