const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'public/frontend/css/style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace url("../something") with url("/frontend/something")
// Also handle single quotes and no quotes
css = css.replace(/url\(\s*['"]?\.\.\/([^'"\)]+)['"]?\s*\)/g, 'url("/frontend/$1")');

fs.writeFileSync(cssPath, css);
console.log('CSS URLs fixed.');
