const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create manifest.json
function createManifest() {
  const manifest = {
    name: "iOS Web Simulator",
    short_name: "iOS Sim",
    description: "A virtual iOS operating system in your browser",
    theme_color: "#000000",
    background_color: "#000000",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon"
      },
      {
        src: "logo192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "logo512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(
    path.join(publicDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('✅ manifest.json created');
}

// Create placeholder files
function createPlaceholderFiles() {
  // Create favicon.ico
  const faviconContent = `
<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#667eea"/>
      <stop offset="100%" stop-color="#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" fill="url(#grad)" rx="12"/>
  <text x="32" y="40" font-family="Arial" font-size="32" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle">📱</text>
</svg>`;
  
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconContent);
  
  // Create README.md for public folder
  const readmeContent = `# iOS Web Simulator - Assets

This folder contains the static assets for the iOS Web Simulator.

## Required Files:
1. favicon.ico - App icon (64x64 recommended)
2. logo192.png - PWA icon (192x192)
3. logo512.png - PWA icon (512x512)
4. wallpaper.jpg - iOS-style background wallpaper

## To add your own assets:
1. Replace favicon.ico with your own icon
2. Add wallpaper.jpg (recommended size: 1170x2532 for iPhone 14 Pro)
3. Update logo192.png and logo512.png for PWA

## Using default assets:
You can use the placeholder SVG files or download from:
- Wallpaper: https://images.unsplash.com/photo-1502741338009-5b3f2a1b4e8d
- Icons: Use https://favicon.io/ to generate icons`;
  
  fs.writeFileSync(path.join(publicDir, 'README.md'), readmeContent);
  console.log('✅ Placeholder files created');
}

// Create all assets
function createAllAssets() {
  console.log('🔄 Creating assets...');
  createManifest();
  createPlaceholderFiles();
  console.log('✅ All assets created!');
  console.log('\n📝 Next steps:');
  console.log('1. Add actual wallpaper.jpg to public/ folder');
  console.log('2. Generate favicon.ico from favicon.io');
  console.log('3. Create logo192.png and logo512.png for PWA');
}

createAllAssets();
