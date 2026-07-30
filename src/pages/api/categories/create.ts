import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../lib/activity';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = formData.get('imageUrl') as string || '';

    const categoriesPath = path.join(process.cwd(), 'src/data/categories.json');
    const existingData = await fs.readFile(categoriesPath, 'utf-8');
    const categories = JSON.parse(existingData);

    const newCategory = {
      id: categories.length + 1,
      name,
      slug,
      description,
      image: imageUrl,
      order
    };

    categories.push(newCategory);
    await fs.writeFile(categoriesPath, JSON.stringify(categories, null, 2));

    logActivity(`Added new category "${name}"`, 'create');

    return redirect('/admin/categories', 302);
  } catch (error) {
    console.error(error);
    return new Response('Error creating category', { status: 500 });
  }
};