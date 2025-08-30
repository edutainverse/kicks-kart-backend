import 'dotenv/config';
import { connect } from './src/db/connect.js';
import Product from './src/modules/products/product.model.js';
import { env } from './src/config/env.js';

// Image mapping based on product categories/types
const imageMapping = {
  running: {
    mainImage: '/api/images/shoes/running_1.png',
    images: ['/api/images/shoes/running_1.png', '/api/images/shoes/running_2.png']
  },
  basketball: {
    mainImage: '/api/images/shoes/basketball_1.png', 
    images: ['/api/images/shoes/basketball_1.png', '/api/images/shoes/basketball_2.png']
  },
  oxford: {
    mainImage: '/api/images/shoes/oxford_1.png',
    images: ['/api/images/shoes/oxford_1.png', '/api/images/shoes/oxford_2.png']
  },
  football: {
    mainImage: '/api/images/shoes/football_1.png',
    images: ['/api/images/shoes/football_1.png', '/api/images/shoes/football_2.png']
  }
};

// Category mapping - map product categories to image types
const categoryToImageType = {
  'running': 'running',
  'sneakers': 'basketball',
  'casual': 'oxford',
  'formal': 'oxford',
  'kids': 'running',
  'sports': 'football'
};

async function updateProductImages() {
  try {
    console.log('🚀 Starting image update process...');
    await connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update`);

    let updated = 0;

    for (const product of products) {
      let imageType = null;
      
      if (categoryToImageType[product.category]) {
        imageType = categoryToImageType[product.category];
      } else {
        const title = product.title.toLowerCase();
        if (title.includes('running') || title.includes('run')) {
          imageType = 'running';
        } else if (title.includes('basketball') || title.includes('basket')) {
          imageType = 'basketball';
        } else if (title.includes('oxford') || title.includes('dress') || title.includes('formal')) {
          imageType = 'oxford';
        } else if (title.includes('football') || title.includes('soccer') || title.includes('cleat')) {
          imageType = 'football';
        } else {
          imageType = 'running';
        }
      }

      const imageData = imageMapping[imageType];
      
      if (imageData) {
        await Product.findByIdAndUpdate(product._id, {
          mainImage: imageData.mainImage,
          images: imageData.images
        });
        
        console.log(`✨ Updated "${product.title}" with ${imageType} images`);
        updated++;
      }
    }

    console.log(`\n🎉 Successfully updated ${updated} products with images`);
    console.log('\n📸 Image assignments:');
    console.log('  - Running shoes: /api/images/shoes/running_1.png, running_2.png');
    console.log('  - Basketball/Sneakers: /api/images/shoes/basketball_1.png, basketball_2.png');
    console.log('  - Oxford/Casual/Formal: /api/images/shoes/oxford_1.png, oxford_2.png');
    console.log('  - Football/Sports: /api/images/shoes/football_1.png, football_2.png');
    console.log('\n📁 Images served from: backend/public/images/shoes/');
    console.log('🌐 Accessible at: http://localhost:4000/api/images/shoes/');
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  } finally {
    process.exit(0);
  }
}

updateProductImages();
