const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate favicon.ico (simple 64x64 icon)
function generateFavicon() {
  const size = 64;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  // iOS logo
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📱', size/2, size/2);

  // Save as PNG (we'll convert to ICO later)
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'favicon.png'), buffer);
  console.log('✅ Generated favicon.png');
}

// Generate app icons
function generateAppIcons() {
  const sizes = [192, 512];
  
  sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // iOS-style gradient background
    const gradient = ctx.createRadialGradient(
      size/2, size/2, 0,
      size/2, size/2, size/2
    );
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Phone icon
    ctx.fillStyle = '#ffffff';
    const iconSize = size * 0.6;
    ctx.font = `bold ${iconSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📱', size/2, size/2);
    
    // iOS text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `bold ${size * 0.1}px Arial`;
    ctx.fillText('iOS Sim', size/2, size * 0.85);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(publicDir, `logo${size}.png`), buffer);
    console.log(`✅ Generated logo${size}.png`);
  });
}

// Generate wallpaper
function generateWallpaper() {
  const width = 1170;
  const height = 2532; // iPhone 14 Pro Max resolution
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f0c29');
  gradient.addColorStop(0.5, '#302b63');
  gradient.addColorStop(1, '#24243e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add subtle noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 3;
    ctx.fillRect(x, y, size, size);
  }
  
  // Add floating elements (iOS-style bubbles)
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 100 + 50;
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${Math.random() * 0.05})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(path.join(publicDir, 'wallpaper.jpg'), buffer);
  console.log('✅ Generated wallpaper.jpg');
}

// Generate screenshot for PWA
function generateScreenshot() {
  const width = 1284;
  const height = 2778;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Dark background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  
  // Phone frame
  const phoneWidth = width * 0.9;
  const phoneHeight = height * 0.9;
  const phoneX = (width - phoneWidth) / 2;
  const phoneY = (height - phoneHeight) / 2;
  
  // Phone body
  ctx.fillStyle = '#1a1a1a';
  ctx.roundRect(phoneX, phoneY, phoneWidth, phoneHeight, 60);
  ctx.fill();
  
  // Screen
  const screenWidth = phoneWidth * 0.92;
  const screenHeight = phoneHeight * 0.94;
  const screenX = phoneX + (phoneWidth - screenWidth) / 2;
  const screenY = phoneY + (phoneHeight - screenHeight) / 2;
  
  // Screen gradient
  const screenGradient = ctx.createLinearGradient(screenX, screenY, screenX + screenWidth, screenY + screenHeight);
  screenGradient.addColorStop(0, '#0f0c29');
  screenGradient.addColorStop(1, '#302b63');
  ctx.fillStyle = screenGradient;
  ctx.roundRect(screenX, screenY, screenWidth, screenHeight, 40);
  ctx.fill();
  
  // App icons on screen
  const iconSize = screenWidth / 6;
  const cols = 4;
  const rows = 6;
  
  const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55'];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = screenX + col * (iconSize + iconSize/2) + iconSize/2;
      const y = screenY + row * (iconSize + iconSize/2) + iconSize/2 + 50;
      
      // Icon background
      ctx.fillStyle = colors[(row * cols + col) % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, iconSize/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Icon letter
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `bold ${iconSize/2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const letters = ['N', 'M', 'C', 'P', 'S', 'W', 'A', 'F', 'G', 'B', 'K', 'L'];
      ctx.fillText(letters[row * cols + col] || 'A', x, y);
    }
  }
  
  // Dynamic Island
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(screenX + screenWidth/2, screenY + 60, 80, 25, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Status Bar
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('9:41', screenX + 50, screenY + 45);
  
  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'screenshot1.png'), buffer);
  console.log('✅ Generated screenshot1.png');
}

// Add roundRect method if not exists
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };
}

// Run all generators
async function generateAll() {
  try {
    console.log('🔄 Generating assets...');
    generateFavicon();
    generateAppIcons();
    generateWallpaper();
    generateScreenshot();
    console.log('✅ All assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating assets:', error);
  }
}

generateAll();
