import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../lib/activity';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const currency = formData.get('currency') as string || 'USD';
    const rating = parseFloat(formData.get('rating') as string) || 0;
    const reviews = parseInt(formData.get('reviews') as string) || 0;
    const featured = formData.get('featured') === 'true';
    const description = formData.get('description') as string;
    const detailDescription = formData.get('detailDescription') as string;
    const tagsStr = formData.get('tags') as string;
    const buyLink = formData.get('buyLink') as string;
    const mainImageUrl = formData.get('mainImageUrl') as string;
    const galleryUrlsStr = formData.get('galleryUrls') as string;
    
    const galleryUrls = galleryUrlsStr ? galleryUrlsStr.split(',').map(u => u.trim()).filter(u => u) : [];
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];

    const newProduct = {
      id: Date.now(),
      slug,
      name,
      category,
      price,
      currency,
      rating,
      reviews,
      featured,
      description,
      detailDescription: detailDescription || '',
      tags,
      images: {
        main: mainImageUrl || `https://picsum.photos/seed/${slug}/600/400`,
        gallery: galleryUrls
      },
      buyLink: buyLink || `https://builtbybit.com/resources/${slug}`
    };

    const filePath = path.join(process.cwd(), 'src/data/products', `${slug}.json`);
    await fs.writeFile(filePath, JSON.stringify(newProduct, null, 2));

    logActivity(`Added new product "${name}"`, 'create');

    return redirect('/admin/products', 302);
  } catch (error) {
    console.error(error);
    return new Response('Error creating product', { status: 500 });
  }
};