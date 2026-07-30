import type { APIRoute } from 'astro';
import { promises as fs } from 'fs';
import path from 'path';
import { logActivity } from '../../../lib/activity';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const section = formData.get('section') as string;
    const homePath = path.join(process.cwd(), 'src/data/pages/home.json');
    
    const existingData = await fs.readFile(homePath, 'utf-8');
    const home = JSON.parse(existingData);

    switch (section) {
      case 'hero':
        home.hero.tag = formData.get('heroTag') as string || home.hero.tag;
        home.hero.heading = formData.get('heroHeading') as string || home.hero.heading;
        home.hero.subtext = formData.get('heroSubtext') as string || home.hero.subtext;
        home.hero.primaryButton.text = formData.get('heroPrimaryText') as string || home.hero.primaryButton.text;
        home.hero.primaryButton.url = formData.get('heroPrimaryUrl') as string || home.hero.primaryButton.url;
        home.hero.secondaryButton.text = formData.get('heroSecondaryText') as string || home.hero.secondaryButton.text;
        home.hero.secondaryButton.url = formData.get('heroSecondaryUrl') as string || home.hero.secondaryButton.url;
        if (home.hero.stats && home.hero.stats.length === 3) {
          home.hero.stats[0].number = formData.get('stat1Number') as string || home.hero.stats[0].number;
          home.hero.stats[0].label = formData.get('stat1Label') as string || home.hero.stats[0].label;
          home.hero.stats[1].number = formData.get('stat2Number') as string || home.hero.stats[1].number;
          home.hero.stats[1].label = formData.get('stat2Label') as string || home.hero.stats[1].label;
          home.hero.stats[2].number = formData.get('stat3Number') as string || home.hero.stats[2].number;
          home.hero.stats[2].label = formData.get('stat3Label') as string || home.hero.stats[2].label;
        }
        break;

      case 'features':
        home.features.tag = formData.get('featuresTag') as string || home.features.tag;
        home.features.heading = formData.get('featuresHeading') as string || home.features.heading;
        home.features.subtext = formData.get('featuresSubtext') as string || home.features.subtext;
        
        for (let i = 0; i < 6 && i < home.features.features.length; i++) {
          const title = formData.get(`featureTitle${i + 1}`) as string;
          const desc = formData.get(`featureDesc${i + 1}`) as string;
          const icon = formData.get(`featureIcon${i + 1}`) as string;
          if (title !== null && title !== undefined) home.features.features[i].title = title;
          if (desc !== null && desc !== undefined) home.features.features[i].description = desc;
          if (icon !== null && icon !== undefined && icon !== '') home.features.features[i].icon = icon;
        }
        
        // Stats for first feature card with icon selection
        if (home.features.features[0]) {
          const stats = [];
          for (let i = 0; i < 6; i++) {
            const label = formData.get(`statLabel${i + 1}`) as string;
            const icon = formData.get(`statIcon${i + 1}`) as string;
            if (label !== null && label !== undefined && label.trim() !== '') {
              stats.push({
                icon: icon || 'check',
                label: label
              });
            }
          }
          if (stats.length > 0) {
            home.features.features[0].stats = stats;
          }
        }
        break;

      case 'categories':
        home.categories.tag = formData.get('categoriesTag') as string || home.categories.tag;
        home.categories.heading = formData.get('categoriesHeading') as string || home.categories.heading;
        home.categories.subtext = formData.get('categoriesSubtext') as string || home.categories.subtext;
        home.categories.buttonText = formData.get('categoriesButtonText') as string || home.categories.buttonText;
        break;

      case 'reviews':
        home.reviews.tag = formData.get('reviewsTag') as string || home.reviews.tag;
        home.reviews.heading = formData.get('reviewsHeading') as string || home.reviews.heading;
        home.reviews.subtext = formData.get('reviewsSubtext') as string || home.reviews.subtext;
        for (let i = 0; i < home.reviews.reviews.length; i++) {
          const name = formData.get(`reviewName_${i}`) as string;
          const role = formData.get(`reviewRole_${i}`) as string;
          const text = formData.get(`reviewText_${i}`) as string;
          const rating = parseInt(formData.get(`reviewRating_${i}`) as string) || 5;
          const initial = formData.get(`reviewInitial_${i}`) as string;
          if (name !== null && name !== undefined) home.reviews.reviews[i].name = name;
          if (role !== null && role !== undefined) home.reviews.reviews[i].role = role;
          if (text !== null && text !== undefined) home.reviews.reviews[i].text = text;
          if (rating) home.reviews.reviews[i].rating = rating;
          if (initial !== null && initial !== undefined) home.reviews.reviews[i].initial = initial;
        }
        break;

      case 'cta':
        home.cta.heading = formData.get('ctaHeading') as string || home.cta.heading;
        home.cta.subtext = formData.get('ctaSubtext') as string || home.cta.subtext;
        home.cta.primaryButton.text = formData.get('ctaPrimaryText') as string || home.cta.primaryButton.text;
        home.cta.primaryButton.url = formData.get('ctaPrimaryUrl') as string || home.cta.primaryButton.url;
        home.cta.secondaryButton.text = formData.get('ctaSecondaryText') as string || home.cta.secondaryButton.text;
        home.cta.secondaryButton.url = formData.get('ctaSecondaryUrl') as string || home.cta.secondaryButton.url;
        break;

      case 'marquee':
        const row1Items = [];
        const row2Items = [];
        for (let i = 0; i < 5; i++) {
          const r1 = formData.get(`marqueeRow1_${i}`) as string;
          const r2 = formData.get(`marqueeRow2_${i}`) as string;
          if (r1 && r1.trim()) row1Items.push(r1.trim());
          if (r2 && r2.trim()) row2Items.push(r2.trim());
        }
        if (row1Items.length > 0) home.marquee.row1 = row1Items;
        else home.marquee.row1 = home.marquee.row1 || [];
        if (row2Items.length > 0) home.marquee.row2 = row2Items;
        else home.marquee.row2 = home.marquee.row2 || [];
        break;

      default:
        return new Response('Invalid section', { status: 400 });
    }

    await fs.writeFile(homePath, JSON.stringify(home, null, 2));

    logActivity('Updated homepage content', 'update');

    return redirect('/admin/homepage?section=' + section, 302);
  } catch (error) {
    console.error(error);
    return new Response('Error updating homepage: ' + error.message, { status: 500 });
  }
};