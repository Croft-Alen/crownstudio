import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../lib/activity';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    
    const aboutPath = path.join(process.cwd(), 'src/data/pages/about.json');
    const existingData = await fs.readFile(aboutPath, 'utf-8');
    const about = JSON.parse(existingData);

    about.hero.tag = formData.get('heroTag') as string || about.hero.tag;
    about.hero.heading = formData.get('heroHeading') as string || about.hero.heading;
    about.hero.subtext = formData.get('heroSubtext') as string || about.hero.subtext;
    
    about.story.heading = formData.get('storyHeading') as string || about.story.heading;
    about.story.paragraphs = [
      formData.get('storyParagraph1') as string || about.story.paragraphs[0] || '',
      formData.get('storyParagraph2') as string || about.story.paragraphs[1] || ''
    ].filter(p => p);
    
    about.story.stat.number = formData.get('statNumber') as string || about.story.stat.number;
    about.story.stat.label = formData.get('statLabel') as string || about.story.stat.label;
    about.story.stat.subtext = formData.get('statSubtext') as string || about.story.stat.subtext;
    
    const teamMembers = [];
    for (let i = 0; i < 4; i++) {
      const name = formData.get(`teamName${i}`) as string;
      if (name && name.trim()) {
        teamMembers.push({
          name: name.trim(),
          role: formData.get(`teamRole${i}`) as string || '',
          initial: formData.get(`teamInitial${i}`) as string || name.charAt(0).toUpperCase(),
          bio: formData.get(`teamBio${i}`) as string || '',
          image: formData.get(`teamImage${i}`) as string || ''
        });
      }
    }
    if (teamMembers.length > 0) {
      about.team.members = teamMembers;
    }

    await fs.writeFile(aboutPath, JSON.stringify(about, null, 2));

    logActivity('Updated about page', 'update');

    return redirect('/admin/about', 302);
  } catch (error) {
    console.error(error);
    return new Response('Error updating about page: ' + error.message, { status: 500 });
  }
};