import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../../lib/activity';

export const GET: APIRoute = async ({ params, redirect }) => {
  try {
    const { slug } = params;
    
    if (!slug) {
      return new Response('Slug is required', { status: 400 });
    }

    const categoriesPath = path.join(process.cwd(), 'src/data/categories.json');
    const existingData = await fs.readFile(categoriesPath, 'utf-8');
    const categories = JSON.parse(existingData);
    
    const index = categories.findIndex((c: any) => c.slug === slug);
    if (index === -1) {
      return new Response('Category not found', { status: 404 });
    }
    
    const categoryName = categories[index].name;
    
    categories.splice(index, 1);
    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));

    logActivity(`Deleted category "${categoryName}"`, 'delete');

    return redirect('/admin/categories', 302);
  } catch (error) {
    return new Response('Server error: ' + error.message, { status: 500 });
  }
};