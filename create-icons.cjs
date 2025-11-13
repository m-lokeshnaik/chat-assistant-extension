// Simple script to create placeholder icons
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src', 'icons');

// Create instructions file
const instructions = `# QUICK FIX: Add Icons Here

You need 4 PNG files in this folder:
- icon16.png (16×16 pixels)
- icon32.png (32×32 pixels)  
- icon48.png (48×48 pixels)
- icon128.png (128×128 pixels)

EASIEST WAY:
1. Go to: https://www.favicon-generator.org/
2. Upload any image or create a simple design
3. Download the generated icons
4. Rename and place them here:
   - favicon-16x16.png → icon16.png
   - favicon-32x32.png → icon32.png
   - favicon-48x48.png → icon48.png
   - favicon-128x128.png → icon128.png

OR use any image editor:
- Create a 128×128px colored circle/square
- Resize to create all 4 sizes
- Save as PNG files with exact names above

Then run: npm run build
`;

fs.writeFileSync(path.join(iconsDir, 'README_ICONS.txt'), instructions);
console.log('✅ Instructions created in src/icons/README_ICONS.txt');
console.log('\n📋 Quick steps:');
console.log('1. Visit: https://www.favicon-generator.org/');
console.log('2. Create/download icons');
console.log('3. Place 4 PNG files in src/icons/');
console.log('4. Run: npm run build');

