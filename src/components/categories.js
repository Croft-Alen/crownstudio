import categoriesData from './categories.json';

// Get all categories with product counts
export function getCategories() {
  return categoriesData;
}

// Get a single category by slug
export function getCategoryBySlug(slug) {
  return categoriesData.find(cat => cat.slug === slug);
}

// Get categories with product counts
import { products } from './products.js';

export function getCategoriesWithCounts() {
  return categoriesData.map(cat => {
    const count = products.filter(p => p.category === cat.slug).length;
    return {
      ...cat,
      count
    };
  });
}