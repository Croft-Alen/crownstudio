import type { APIContext } from 'astro';

export async function GET({ cookies }: APIContext) {
  cookies.delete('admin_session', { 
    path: '/' 
  });
  
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin/login'
    }
  });
}