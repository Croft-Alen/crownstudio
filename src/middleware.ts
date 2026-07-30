import { defineMiddleware } from 'astro/middleware';

export const onRequest = defineMiddleware((context, next) => {
  if (!context.url.pathname.startsWith('/admin')) {
    return next();
  }

  if (
    context.url.pathname.startsWith('/admin/login') ||
    context.url.pathname.startsWith('/api/admin/login') ||
    context.url.pathname.startsWith('/api/admin/logout') ||
    context.url.pathname === '/admin' ||
    context.url.pathname === '/admin/'
  ) {
    return next();
  }

  const session = context.cookies.get('admin_session');
  
  if (!session || session.value !== 'authenticated') {
    return context.redirect('/admin/login');
  }
  
  return next();
});