import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const svgPath = path.join(publicDir, 'og-image.svg');
const pngPath = path.join(publicDir, 'og-image.png');

// Check if SVG exists
if (!fs.existsSync(svgPath)) {
  console.error('❌ og-image.svg not found in /public folder');
  process.exit(1);
}

try {
  // Read SVG file
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Convert SVG to PNG using Sharp
  await sharp(svgBuffer)
    .png()
    .resize(1200, 630)
    .toFile(pngPath);
  
  console.log('✅ Successfully converted og-image.svg to og-image.png');
  console.log(`📁 PNG file created at: ${pngPath}`);
  
  // Check file size
  const stats = fs.statSync(pngPath);
  console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);
  
} catch (error) {
  console.error('❌ Error converting SVG to PNG:', error.message);
  process.exit(1);
}