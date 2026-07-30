import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../../lib/activity';

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    const { slug } = params;
    const filePath = path.join(process.cwd(), 'src/data/products', `${slug}.json`);
    
    const existingData = await fs.readFile(filePath, 'utf-8');
    const product = JSON.parse(existingData);
    
    const formData = await request.formData();
    
    product.name = formData.get('name') as string || product.name;
    product.slug = formData.get('slug') as string || product.slug;
    product.category = formData.get('category') as string || product.category;
    product.price = parseFloat(formData.get('price') as string) || product.price;
    product.currency = formData.get('currency') as string || product.currency || 'USD';
    product.rating = parseFloat(formData.get('rating') as string) || 0;
    product.reviews = parseInt(formData.get('reviews') as string) || 0;
    product.featured = formData.get('featured') === 'true';
    product.description = formData.get('description') as string || product.description;
    product.buyLink = formData.get('buyLink') as string || product.buyLink;
    
    const tagsStr = formData.get('tags') as string;
    product.tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : product.tags || [];
    
    const mainImageUrl = formData.get('mainImageUrl') as string;
    const galleryUrlsStr = formData.get('galleryUrls') as string;
    
    if (mainImageUrl !== undefined && mainImageUrl !== null) {
      product.images.main = mainImageUrl.trim() || '';
    }
    
    if (galleryUrlsStr !== undefined && galleryUrlsStr !== null) {
      const galleryUrls = galleryUrlsStr.split(',').map(u => u.trim()).filter(u => u);
      product.images.gallery = galleryUrls;
    }
    
    // Store detailDescription as raw HTML string
    const detailDescription = formData.get('detailDescription') as string;
    if (detailDescription !== undefined && detailDescription !== null) {
      product.detailDescription = detailDescription;
    }
    
    const newSlug = formData.get('slug') as string;
    if (newSlug && newSlug !== slug) {
      const newPath = path.join(process.cwd(), 'src/data/products', `${newSlug}.json`);
      await fs.writeFile(newPath, JSON.stringify(product, null, 2));
      await fs.unlink(filePath);
      
      logActivity(`Updated product "${product.name}"`, 'update');
      
      return redirect('/admin/products', 302);
    }
    
    await fs.writeFile(filePath, JSON.stringify(product, null, 2));

    logActivity(`Updated product "${product.name}"`, 'update');

    return redirect('/admin/products', 302);
  } catch (error) {
    console.error(error);
    return new Response('Error updating product: ' + error.message, { status: 500 });
  }
};