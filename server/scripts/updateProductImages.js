#!/usr/bin/env node

/**
 * Script to update existing products with better, category-relevant images
 * This script will reassign images to products based on their title and category
 */

const { Product } = require('../models');
const { updateProductImage } = require('../utils/imageUtils');

async function updateAllProductImages() {
  try {
    console.log('🔄 Starting product image update for unique images...');

    // Get all products
    const products = await Product.findAll({
      attributes: ['id', 'title', 'category', 'imageUrl']
    });

    console.log(`📦 Found ${products.length} products to update`);

    let updatedCount = 0;
    const processedImages = new Set(); // Track used image URLs to ensure uniqueness

    for (const product of products) {
      try {
        let newImageUrl;
        let attempts = 0;
        const maxAttempts = 5;

        // Try to generate a unique image URL
        do {
          newImageUrl = updateProductImage({
            title: product.title + (attempts > 0 ? ` variant${attempts}` : ''),
            category: product.category,
            imageUrl: null // Force new image generation
          });
          attempts++;
        } while (processedImages.has(newImageUrl) && attempts < maxAttempts);

        // If we couldn't get a unique URL after max attempts, use it anyway
        if (attempts >= maxAttempts) {
          console.log(`⚠️  Using potentially duplicate image for "${product.title}" after ${maxAttempts} attempts`);
        }

        processedImages.add(newImageUrl);

        // Update the product with new image URL
        await product.update({ imageUrl: newImageUrl });

        console.log(`✅ Updated "${product.title}" with unique image: ${newImageUrl}`);
        updatedCount++;

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Failed to update product "${product.title}":`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} out of ${products.length} products`);
    console.log(`📊 Generated ${processedImages.size} unique image URLs`);

  } catch (error) {
    console.error('💥 Error updating product images:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  updateAllProductImages()
    .then(() => {
      console.log('✨ Product image update completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { updateAllProductImages };
