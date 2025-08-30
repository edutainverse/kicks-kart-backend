import 'dotenv/config';
import { connect } from './src/db/connect.js';
import Product from './src/modules/products/product.model.js';
import { env } from './src/config/env.js';

// Image mapping based on product categories/types
const imageMapping = {
  running: {
    mainImage: '/images/shoes/running_1.png',
    images: ['/images/shoes/running_1.png', '/images/shoes/running_2.png']
  },
  basketball: {
    mainImage: '/images/shoes/basketball_1.png', 
    images: ['/images/shoes/basketball_1.png', '/images/shoes/basketball_2.png']
  },
  oxford: {
    mainImage: '/images/shoes/oxford_1.png',
    images: ['/images/shoes/oxford_1.png', '/images/shoes/oxford_2.png']
  },
  football: {
    mainImage: '/images/shoes/football_1.png',
    images: ['/images/shoes/football_1.png', '/images/shoes/football_2.png']
  }
};

// Category mapping - map product categories to image types
const categoryToImageType = {
  'running': 'running',
  'sneakers': 'basketball', // Use basketball images for sneakers
  'casual': 'oxford',       // Use oxford for casual
  'formal': 'oxford',       // Use oxford for formal
  'kids': 'running',        // Use running for kids
  'sports': 'football'      // Use football for sports
};

async function updateProductImages() {
  try {
    await connect(env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    let updated = 0;

    for (const product of products) {
      // Determine image type based on category or title
      let imageType = null;
      
      // Try to match by category first
      if (categoryToImageType[product.category]) {
        imageType = categoryToImageType[product.category];
      } else {
        // Try to match by title keywords
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
          // Default fallback based on category
          imageType = 'running'; // Default to running shoes
        }
      }

      // Get images for this type
      const imageData = imageMapping[imageType];
      
      if (imageData) {
        // Update product with images (mainImage is first image)
        await Product.findByIdAndUpdate(product._id, {
          mainImage: imageData.mainImage,
          images: imageData.images
        });
        
        console.log(`Updated ${product.title} with ${imageType} images`);
        updated++;
      }
    }

    console.log(`\n✅ Successfully updated ${updated} products with images`);
    console.log('\nImage assignments:');
    console.log('- Running shoes: running_1.png, running_2.png');
    console.log('- Basketball/Sneakers: basketball_1.png, basketball_2.png');
    console.log('- Oxford/Casual/Formal: oxford_1.png, oxford_2.png');
    console.log('- Football/Sports: football_1.png, football_2.png');
    
  } catch (error) {
    console.error('Error updating product images:', error);
  } finally {
    process.exit(0);
  }
}

updateProductImages();
