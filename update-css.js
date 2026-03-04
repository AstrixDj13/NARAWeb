const fs = require('fs');
const path = require('path');

const cssPath = path.join(process.cwd(), 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// The new font faces replacing all the old ones
const newFonts = `
@font-face {
  font-family: "Antikor Mono";
  src: url("./fonts/antikor_mono/Taner Ardali  Antikor Mono Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  size-adjust: 100%;
  ascent-override: normal;
  descent-override: normal;
  line-gap-override: normal;
}

@font-face {
  font-family: "Antikor Mono";
  src: url("./fonts/antikor_mono/Taner Ardali  Antikor Mono Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  size-adjust: 100%;
  ascent-override: normal;
  descent-override: normal;
  line-gap-override: normal;
}

@font-face {
  font-family: "Antikor Mono";
  src: url("./fonts/antikor_mono/Taner Ardali  Antikor Mono Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
  size-adjust: 100%;
  ascent-override: normal;
  descent-override: normal;
  line-gap-override: normal;
}

@font-face {
  font-family: "outfit";
  src: url("./fonts/Outfit/outfit_variable.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  size-adjust: 100%;
  ascent-override: normal;
  descent-override: normal;
  line-gap-override: normal;
}
`;

// Regex to strip out all existing @font-face blocks
const strippedCss = css.replace(/@font-face\s*{[^}]*}/g, '');

// Re-inject the new fonts right after the tailwind directives
const tailwindDirectives = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n";
const finalCss = strippedCss.replace(tailwindDirectives, tailwindDirectives + newFonts);

fs.writeFileSync(cssPath, finalCss.replace(/\n\s*\n\s*\n/g, '\n\n'));
console.log("Rewrote index.css with WOFF2 and exact font weights");
