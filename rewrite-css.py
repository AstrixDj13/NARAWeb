import os
import re

css_path = os.path.join('src', 'index.css')
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)

new_fonts = """
@font-face {
  font-family: "Antikor Mono";
  src: url("./fonts/antikor_mono/Taner Ardali  Antikor Mono Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Antikor Mono";
  src: url("./fonts/antikor_mono/Taner Ardali  Antikor Mono Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Antikor Mono";
  src: url("./fonts/antikor_mono/Taner Ardali  Antikor Mono Bold.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "outfit";
  src: url("./fonts/Outfit/outfit_variable.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
"""

css = css.replace('@tailwind utilities;', '@tailwind utilities;\n' + new_fonts)
css = re.sub(r'\n{3,}', '\n\n', css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("Rewrote index.css with strict WOFF2 imports")
