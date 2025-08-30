import fs from 'fs';
import path from 'path';

// Simple 1x1 pixel PNG in base64 (different colors)
const images = {
  'running_1.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77UgAAAABJRU5ErkJggg==', // transparent
  'running_2.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+BQwACCQMDDSg+6gAAAABJRU5ErkJggg==', // blue
  'basketball_1.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/585g4ECAQM/AAHyJQAAAABJRU5ErkJggg==', // orange
  'basketball_2.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BgwECCQMDDZ8+UgAAAABJRU5ErkJggg==', // red
  'oxford_1.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYGBgwAAABgABIQA=', // gray
  'oxford_2.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkZGBgwAAABgABIQA=', // dark gray
  'football_1.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77UgAAAABJRU5ErkJggg==', // green
  'football_2.png': 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/58BgwECCQMDDZ8+UgAAAABJRU5ErkJggg==' // light green
};

// Better approach: Create a larger colored rectangle PNG
const createColoredPNG = (color) => {
  // 300x200 PNG with solid color - this is a simple base64 encoded PNG
  // For now, let's use a simple approach - create HTML that renders as an image
  return Buffer.from(`
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color.bg}"/>
  <text x="150" y="80" text-anchor="middle" font-family="Arial" font-size="20" fill="${color.text}">${color.title}</text>
  <text x="150" y="120" text-anchor="middle" font-family="Arial" font-size="14" fill="${color.text}">${color.subtitle}</text>
  <circle cx="150" cy="160" r="20" fill="${color.accent}" opacity="0.7"/>
</svg>
  `.trim());
};

const colorSchemes = {
  'running_1.png': { bg: '#e3f2fd', text: '#1976d2', accent: '#2196f3', title: 'Running Shoe', subtitle: 'Image 1' },
  'running_2.png': { bg: '#e8f5e8', text: '#388e3c', accent: '#4caf50', title: 'Running Shoe', subtitle: 'Image 2' },
  'basketball_1.png': { bg: '#fff3e0', text: '#f57c00', accent: '#ff9800', title: 'Basketball', subtitle: 'Image 1' },
  'basketball_2.png': { bg: '#ffebee', text: '#d32f2f', accent: '#f44336', title: 'Basketball', subtitle: 'Image 2' },
  'oxford_1.png': { bg: '#f5f5f5', text: '#424242', accent: '#757575', title: 'Oxford Shoe', subtitle: 'Image 1' },
  'oxford_2.png': { bg: '#fafafa', text: '#616161', accent: '#9e9e9e', title: 'Oxford Shoe', subtitle: 'Image 2' },
  'football_1.png': { bg: '#e8f5e8', text: '#2e7d32', accent: '#4caf50', title: 'Football Shoe', subtitle: 'Image 1' },
  'football_2.png': { bg: '#e0f2f1', text: '#00695c', accent: '#26a69a', title: 'Football Shoe', subtitle: 'Image 2' }
};

// Ensure directory exists
const imageDir = './public/images/shoes';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Create all image files
Object.entries(colorSchemes).forEach(([filename, colors]) => {
  const svgContent = createColoredPNG(colors);
  fs.writeFileSync(path.join(imageDir, filename), svgContent);
  console.log(`✓ Created ${filename}`);
});

console.log('\n🎉 All placeholder images created successfully!');
console.log('📁 Location: ./public/images/shoes/');
console.log('🌐 Accessible at: http://localhost:4000/api/images/shoes/');
