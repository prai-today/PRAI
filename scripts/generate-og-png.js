import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const pngPath = path.join(publicDir, 'og-image.png');

// Create a simple gradient background programmatically
const createOgImage = async () => {
  try {
    // Create a gradient background using Sharp
    const width = 1200;
    const height = 630;
    
    // Create a simple gradient background
    const gradientSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#0891b2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bgGradient)"/>
        
        <!-- Decorative circles -->
        <circle cx="100" cy="100" r="60" fill="#ffffff" opacity="0.1"/>
        <circle cx="1100" cy="530" r="80" fill="#ffffff" opacity="0.1"/>
        <circle cx="200" cy="500" r="40" fill="#a855f7" opacity="0.2"/>
        <circle cx="1000" cy="150" r="50" fill="#0891b2" opacity="0.2"/>
        
        <!-- Main content area -->
        <rect x="300" y="200" width="600" height="230" rx="20" fill="#ffffff" opacity="0.95"/>
        
        <!-- Title area -->
        <rect x="320" y="220" width="560" height="60" fill="#4f46e5"/>
        <text x="600" y="260" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="#ffffff">PRAI.TODAY</text>
        
        <!-- Subtitle -->
        <text x="600" y="320" font-family="Arial, sans-serif" font-size="24" font-weight="600" text-anchor="middle" fill="#4f46e5">Get Your Product Answered by AI</text>
        
        <!-- Description -->
        <text x="600" y="360" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#6b7280">PR AI Agent for Builders, Founders &amp; SMB Owners</text>
        
        <!-- Call to action -->
        <rect x="450" y="380" width="300" height="40" rx="20" fill="#4f46e5"/>
        <text x="600" y="405" font-family="Arial, sans-serif" font-size="16" font-weight="600" text-anchor="middle" fill="#ffffff">Start PRAI Today</text>
      </svg>
    `;
    
    // Convert to PNG
    await sharp(Buffer.from(gradientSvg))
      .png()
      .resize(width, height)
      .toFile(pngPath);
    
    console.log('✅ Successfully generated og-image.png');
    console.log(`📁 PNG file created at: ${pngPath}`);
    
    // Check file size
    const stats = fs.statSync(pngPath);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);
    
  } catch (error) {
    console.error('❌ Error generating PNG:', error.message);
    process.exit(1);
  }
};

createOgImage();