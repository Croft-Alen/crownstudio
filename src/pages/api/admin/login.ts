import type { APIContext } from 'astro';

export async function POST({ request, cookies }: APIContext) {
  try {
    const formData = await request.formData();
    const password = formData.get('password');
    
    const adminPassword = import.meta.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD is not set in .env file');
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/admin/login?error=true'
        }
      });
    }
    
    if (password === adminPassword) {
      cookies.set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: false,
        sameSite: 'lax',
      });
      
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/admin'
        }
      });
    }
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/admin/login?error=true'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/admin/login?error=true'
      }
    });
  }
}