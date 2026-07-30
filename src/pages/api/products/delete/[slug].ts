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

    const filePath = path.join(process.cwd(), 'src/data/products', `${slug}.json`);
    
    try {
      await fs.access(filePath);
    } catch {
      return new Response('Product not found', { status: 404 });
    }
    
    const existingData = await fs.readFile(filePath, 'utf-8');
    const product = JSON.parse(existingData);
    
    await fs.unlink(filePath);
    
    logActivity(`Deleted product "${product.name}"`, 'delete');

    return redirect('/admin/products', 302);
  } catch (error) {
    return new Response('Server error: ' + error.message, { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { slug } = params;
    
    if (!slug) {
      return new Response(JSON.stringify({ error: 'Slug is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filePath = path.join(process.cwd(), 'src/data/products', `${slug}.json`);
    
    try {
      await fs.access(filePath);
    } catch {
      return new Response(JSON.stringify({ error: 'Product not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const existingData = await fs.readFile(filePath, 'utf-8');
    const product = JSON.parse(existingData);
    
    await fs.unlink(filePath);

    logActivity(`Deleted product "${product.name}"`, 'delete');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error: ' + error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};