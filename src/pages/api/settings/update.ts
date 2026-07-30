import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../lib/activity';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    
    const siteConfigPath = path.join(process.cwd(), 'src/data/site-config.json');
    const existingData = await fs.readFile(siteConfigPath, 'utf-8');
    const config = JSON.parse(existingData);

    config.siteName = formData.get('siteName') as string || config.siteName;
    config.siteDescription = formData.get('siteDescription') as string || config.siteDescription;
    config.logo = formData.get('logo') as string || config.logo;
    config.contact.email = formData.get('contactEmail') as string || config.contact.email;
    config.contact.discord = formData.get('discord') as string || config.contact.discord;
    config.contact.responseTime = formData.get('responseTime') as string || config.contact.responseTime;
    config.socialLinks.discord = formData.get('discordUrl') as string || config.socialLinks.discord || '';
    config.socialLinks.youtube = formData.get('youtube') as string || config.socialLinks.youtube || '';
    config.socialLinks.builtbybit = formData.get('builtbybit') as string || config.socialLinks.builtbybit || '';

    await fs.writeFile(siteConfigPath, JSON.stringify(config, null, 2));

    logActivity('Updated site settings', 'update');

    return redirect('/admin/settings?success=true', 302);
  } catch (error) {
    console.error(error);
    return redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`, 302);
  }
};