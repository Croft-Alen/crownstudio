import fs from 'fs';
import path from 'path';

export interface Activity {
  id: string;
  action: string;
  type: 'create' | 'update' | 'delete';
  timestamp: number;
}

const activityPath = path.join(process.cwd(), 'src', 'data', 'activity.json');

export function getActivities(limit: number = 5): Activity[] {
  try {
    if (!fs.existsSync(activityPath)) {
      fs.writeFileSync(activityPath, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(activityPath, 'utf-8');
    const activities = JSON.parse(data);
    return activities.slice(0, limit);
  } catch {
    return [];
  }
}

export function logActivity(action: string, type: 'create' | 'update' | 'delete'): void {
  try {
    const activities = getActivities(100);
    const newActivity: Activity = {
      id: Date.now().toString(),
      action,
      type,
      timestamp: Date.now()
    };
    activities.unshift(newActivity);
    fs.writeFileSync(activityPath, JSON.stringify(activities, null, 2));
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
}