import type { APIRoute } from 'astro';
import { updateFile } from '../../../lib/github.js';
import { logActivity } from '../../../lib/activity';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    
    const config = {
      siteName: formData.get('siteName') as string || 'CrownStudio',
      siteDescription: formData.get('siteDescription') as string || '',
      logo: formData.get('logo') as string || '',
      contact: {
        email: formData.get('contactEmail') as string || '',
        discord: formData.get('discord') as string || '',
        responseTime: formData.get('responseTime') as string || 'Within 24 hours'
      },
      socialLinks: {
        discord: formData.get('discordUrl') as string || '',
        youtube: formData.get('youtube') as string || '',
        builtbybit: formData.get('builtbybit') as string || ''
      }
    };

    // Save to GitHub instead of local filesystem
    await updateFile(
      'src/data/site-config.json',
      config,
      'Update site settings from CMS'
    );

    logActivity('Updated site settings', 'update');

    return redirect('/admin/settings?success=true', 302);
  } catch (error) {
    console.error('Error saving settings:', error);
    return redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`, 302);
  }
};