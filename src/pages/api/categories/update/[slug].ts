import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../../lib/activity';

export const POST: APIRoute = async ({ params, request, redirect }) => {
  try {
    const { slug } = params;
    const categoriesPath = path.join(process.cwd(), 'src/data/categories.json');
    const existingData = await fs.readFile(categoriesPath, 'utf-8');
    const categories = JSON.parse(existingData);
    
    const index = categories.findIndex((c: any) => c.slug === slug);
    if (index === -1) {
      return new Response('Category not found', { status: 404 });
    }
    
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const newSlug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = formData.get('imageUrl') as string || '';

    const oldName = categories[index].name;
    
    categories[index].name = name || categories[index].name;
    categories[index].slug = newSlug || categories[index].slug;
    categories[index].description = description || categories[index].description;
    categories[index].order = order;
    categories[index].image = imageUrl || categories[index].image || '';

    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));

    logActivity(`Updated category "${oldName}"`, 'update');

    return redirect('/admin/categories', 302);
  } catch (error) {
    console.error(error);
    return new Response('Error updating category: ' + error.message, { status: 500 });
  }
};