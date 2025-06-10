const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgDir = path.join(__dirname, 'images');
const webpDir = path.join(__dirname, 'images/webp');

// Create webp directory if it doesn't exist
if (!fs.existsSync(webpDir)) {
  fs.mkdirSync(webpDir, { recursive: true });
}

// Get all SVG files
const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));

// Convert each SVG to WebP
async function convertFiles() {
  console.log(`Found ${svgFiles.length} SVG files to convert`);
  
  for (const file of svgFiles) {
    try {
      const inputPath = path.join(svgDir, file);
      const outputPath = path.join(webpDir, file.replace('.svg', '.webp'));
      
      console.log(`Converting ${file} to WebP...`);
      
      await sharp(inputPath)
        .webp({ quality: 90 })
        .toFile(outputPath);
        
      console.log(`Successfully converted ${file} to ${file.replace('.svg', '.webp')}`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

convertFiles().then(() => {
  console.log('Conversion complete!');
});
