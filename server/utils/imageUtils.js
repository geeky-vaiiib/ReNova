'use strict';

/**
 * Utility functions for dynamic image assignment based on product name and category
 */

// Category to search term mapping for Unsplash
const categorySearchTerms = {
  'Electronics': ['electronics', 'technology', 'gadgets', 'devices', 'tech', 'digital', 'computer', 'smartphone'],
  'Furniture': ['furniture', 'home', 'interior', 'decor', 'living room', 'bedroom', 'office furniture', 'wooden'],
  'Clothing': ['fashion', 'clothing', 'apparel', 'style', 'outfit', 'wardrobe', 'textile', 'garment'],
  'Sports': ['sports', 'fitness', 'exercise', 'athletic', 'gym', 'outdoor', 'recreation', 'activity'],
  'Books': ['books', 'reading', 'literature', 'library', 'education', 'study', 'knowledge', 'learning'],
  'Music': ['music', 'instruments', 'audio', 'sound', 'musical', 'melody', 'concert', 'performance'],
  'Other': ['objects', 'items', 'products', 'things', 'miscellaneous', 'various', 'collection', 'assorted']
};

// Product name keywords to specific search terms
const productKeywords = {
  // Electronics
  'laptop': 'laptop computer technology',
  'macbook': 'macbook apple laptop',
  'iphone': 'iphone apple smartphone',
  'phone': 'smartphone mobile device',
  'headphones': 'headphones wireless audio',
  'speaker': 'bluetooth speaker audio',
  'camera': 'digital camera photography',
  'tablet': 'tablet ipad device',
  'watch': 'smartwatch apple watch',
  'tv': 'smart television screen',
  'monitor': 'computer monitor display',
  'keyboard': 'mechanical keyboard computer',
  'mouse': 'wireless computer mouse',
  'microwave': 'microwave kitchen appliance',
  'gaming': 'gaming setup computer',
  'console': 'gaming console playstation',
  'router': 'wifi router networking',
  'charger': 'phone charger cable',
  
  // Furniture
  'chair': 'office chair ergonomic',
  'table': 'wooden dining table',
  'desk': 'modern office desk',
  'sofa': 'comfortable living room sofa',
  'couch': 'sectional couch furniture',
  'bed': 'king size bed bedroom',
  'wardrobe': 'wooden wardrobe closet',
  'shelf': 'wooden bookshelf library',
  'cabinet': 'kitchen cabinet storage',
  'dresser': 'bedroom dresser furniture',
  'stool': 'bar stool chair',
  'bench': 'wooden bench seating',
  
  // Clothing
  'shirt': 'shirt clothing',
  'jacket': 'jacket outerwear',
  'jeans': 'jeans denim',
  'dress': 'dress fashion',
  'shoes': 'shoes footwear',
  'sneakers': 'sneakers shoes',
  'boots': 'boots footwear',
  'hat': 'hat accessory',
  'bag': 'bag handbag',
  'backpack': 'backpack bag',
  
  // Sports
  'bike': 'bicycle cycling',
  'bicycle': 'bicycle cycling',
  'cricket': 'cricket sports',
  'football': 'football soccer',
  'basketball': 'basketball sports',
  'tennis': 'tennis racket',
  'badminton': 'badminton racket',
  'gym': 'gym fitness',
  'yoga': 'yoga mat',
  'running': 'running shoes',
  
  // Books
  'book': 'books reading',
  'novel': 'novel books',
  'textbook': 'textbook education',
  'magazine': 'magazine reading',
  'comic': 'comic books',
  
  // Music
  'guitar': 'guitar music',
  'piano': 'piano music',
  'violin': 'violin music',
  'drums': 'drums music',
  'vinyl': 'vinyl records',
  'cd': 'cd music'
};

/**
 * Extract search terms from product title
 * @param {string} title - Product title
 * @returns {string} - Search term for image
 */
function extractSearchTermFromTitle(title) {
  const lowerTitle = title.toLowerCase();
  
  // Check for specific product keywords first
  for (const [keyword, searchTerm] of Object.entries(productKeywords)) {
    if (lowerTitle.includes(keyword)) {
      return searchTerm;
    }
  }
  
  return null;
}

/**
 * Get search term based on category
 * @param {string} category - Product category
 * @returns {string} - Search term for image
 */
function getCategorySearchTerm(category) {
  const terms = categorySearchTerms[category] || categorySearchTerms['Other'];
  // Return a random term from the category to add variety
  return terms[Math.floor(Math.random() * terms.length)];
}

// Curated Unsplash photo collections for different product types
const photoCollections = {
  // Electronics
  'laptop': ['1496181133206-80ce9b88ec61', '1541807084-b4c3d87b2b15', '1517336714731-489689fd1ca8', '1484704849700-f032a568e944', '1498050108023-c5d6c2e6f241'],
  'phone': ['1511707171634-5f897ff02aa9', '1592899677977-9c10ca588bbd', '1574944985070-8f9ebc442d78', '1512941937669-90a1b58e7e2c', '1556656793-08538906a9f8'],
  'headphones': ['1505740420928-5e560c06d30e', '1583394838336-acd977736f90', '1484704849700-f032a568e944', '1545127398-8fefd6ee8b56', '1484704849700-f032a568e944'],
  'camera': ['1606983340126-99ab4feaa64a', '1502920917128-1aa500764cbd', '1526170375885-4d8ecf77b99f', '1516035575624-c417c08e4e75', '1502920917128-1aa500764cbd'],
  'gaming': ['1542751371-adc38448a05e', '1511512578047-aa5b6b6b2b1e', '1593305841991-05c297ba4575', '1560472354-b33ff0c44a43', '1498050108023-c5d6c2e6f241'],

  // Furniture
  'chair': ['1586953208448-b95a79798f07', '1506439773649-6e0eb8cfb237', '1549497538-c571425b4e2c'],
  'table': ['1555041469-a586c61ea9bc', '1549497538-c571425b4e2c', '1586023492125-27b2c045efd7'],
  'sofa': ['1555041469-a586c61ea9bc', '1567538096630-e0c55bd6374c', '1586023492125-27b2c045efd7'],
  'bed': ['1505693416388-ac5ce068fe85', '1540932239986-30128078f3c5', '1522771739844-6a9f6d5f14af'],

  // Clothing & Fashion
  'shoes': ['1549298916-b41d501d3772', '1560769629-975ec94e6a86', '1542291026-7eec264c27ff', '1595950537-e5c83ee08e4a', '1551107696-7f71c5ae2b44'],
  'sneakers': ['1549298916-b41d501d3772', '1560769629-975ec94e6a86', '1595950537-e5c83ee08e4a', '1551107696-7f71c5ae2b44'],
  'jacket': ['1551698618-1dfe5d97d256', '1544966503-7ad532c1002e', '1434389677669-e08b4cac3105'],
  'clothing': ['1441986300917-64674bd600d8', '1445205170230-053b83016050', '1434389677669-e08b4cac3105'],

  // Sports
  'sports': ['1571019613454-1cb2f99b2d8b', '1544966503-7ad532c1002e', '1517963879433-a5ef2267fea8'],
  'fitness': ['1571019613454-1cb2f99b2d8b', '1534438327276-14e5300c3a48', '1517963879433-a5ef2267fea8'],

  // Books
  'books': ['1507003211169-0a1dd7ef0a96', '1481627834876-b7833e8f5570', '1524995997946-a2c2e6a11c65'],
  'novel': ['1507003211169-0a1dd7ef0a96', '1481627834876-b7833e8f5570', '1524995997946-a2c2e6a11c65'],

  // Music
  'guitar': ['1493225457124-a3eb161ffa5f', '1510915361894-db8b60106cb1', '1493225457124-a3eb161ffa5f'],
  'music': ['1493225457124-a3eb161ffa5f', '1510915361894-db8b60106cb1', '1514320675351-0c94e8fe8b8f'],

  // Kitchen
  'kitchen': ['1556909114-f6e7ad7d3136', '1556909114-f6e7ad7d3136', '1574269909862-7e1d70bb8c3f'],
  'microwave': ['1556909114-f6e7ad7d3136', '1574269909862-7e1d70bb8c3f', '1556909114-f6e7ad7d3136'],

  // Default fallbacks
  'default': ['1560472354-b33ff0c44a43', '1441986300917-64674bd600d8', '1571019613454-1cb2f99b2d8b', '1507003211169-0a1dd7ef0a96']
};

/**
 * Generate unique image URL using curated photo collections
 * @param {string} searchTerm - Search term for the image
 * @param {number} width - Image width (default: 600)
 * @param {number} height - Image height (default: 400)
 * @param {string} productTitle - Product title for unique seed
 * @returns {string} - Unique image URL
 */
function generateUnsplashUrl(searchTerm, width = 600, height = 400, productTitle = '') {
  // Create a unique identifier based on product title
  const uniqueId = Math.abs(hashCode(productTitle + Date.now().toString()));

  // Find the best matching photo collection
  let photoCollection = photoCollections['default'];

  // Check for specific keywords in search term
  const lowerSearchTerm = searchTerm.toLowerCase();
  for (const [keyword, photos] of Object.entries(photoCollections)) {
    if (lowerSearchTerm.includes(keyword)) {
      photoCollection = photos;
      break;
    }
  }

  // Select a photo from the collection based on unique ID
  const photoIndex = uniqueId % photoCollection.length;
  const selectedPhotoId = photoCollection[photoIndex];

  // Return Unsplash URL with specific photo ID
  return `https://images.unsplash.com/photo-${selectedPhotoId}?w=${width}&h=${height}&fit=crop&crop=center&auto=format&q=80`;
}

/**
 * Simple hash function to create consistent seeds
 * @param {string} str - String to hash
 * @returns {number} - Hash code
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}

/**
 * Generate fallback image URL using Picsum
 * @param {number} width - Image width (default: 600)
 * @param {number} height - Image height (default: 400)
 * @returns {string} - Picsum image URL
 */
function generateFallbackUrl(width = 600, height = 400) {
  // Use a random seed for variety
  const seed = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

/**
 * Generate appropriate image URL for a product
 * @param {string} title - Product title
 * @param {string} category - Product category
 * @param {string|null} existingImageUrl - Existing image URL (if any)
 * @returns {string} - Generated image URL
 */
function generateProductImageUrl(title, category, existingImageUrl = null) {
  // If there's already a valid image URL, keep it
  if (existingImageUrl && existingImageUrl.trim() && isValidImageUrl(existingImageUrl)) {
    return existingImageUrl.trim();
  }

  // Try to get search term from product title first
  let searchTerm = extractSearchTermFromTitle(title);

  // If no specific term found, use category-based term
  if (!searchTerm) {
    searchTerm = getCategorySearchTerm(category);
  }

  // Generate Unsplash URL with unique seed based on product title
  return generateUnsplashUrl(searchTerm, 600, 400, title);
}

/**
 * Basic URL validation
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
function isValidImageUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Update existing products with better images (for migration)
 * @param {Object} product - Product object with title, category, imageUrl
 * @returns {string} - New image URL
 */
function updateProductImage(product) {
  const { title, category, imageUrl } = product;

  // Always generate a new image based on title/category for migration
  let searchTerm = extractSearchTermFromTitle(title);

  if (!searchTerm) {
    searchTerm = getCategorySearchTerm(category);
  }

  return generateUnsplashUrl(searchTerm, 600, 400, title);
}

module.exports = {
  generateProductImageUrl,
  updateProductImage,
  extractSearchTermFromTitle,
  getCategorySearchTerm,
  generateUnsplashUrl,
  generateFallbackUrl,
  isValidImageUrl
};
