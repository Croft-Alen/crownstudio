// Import all product JSON files
const productFiles = import.meta.glob('./products/*.json', { eager: true });

// Convert to array and sort by ID
export const products = Object.values(productFiles)
  .map(file => file.default)
  .sort((a, b) => a.id - b.id);

// Helper functions
export function getProductBySlug(slug) {
  return products.find(p => p.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter(p => p.featured);
}

export function getRelatedProducts(slug, limit = 3) {
  const current = getProductBySlug(slug);
  if (!current) return [];
  return products
    .filter(p => p.id !== current.id && p.category === current.category)
    .slice(0, limit);
}

// Get all unique category slugs from products
export function getCategorySlugs() {
  const cats = new Set(products.map(p => p.category));
  return Array.from(cats);
}

// Get categories with product counts
export function getCategoriesWithCounts() {
  const categories = getCategorySlugs();
  return categories.map(cat => ({
    name: cat,
    slug: cat.toLowerCase(),
    count: products.filter(p => p.category === cat).length
  }));
}