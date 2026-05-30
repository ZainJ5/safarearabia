import { createCrudRoutes } from '@/lib/adminCrud';
import Activity from '@/models/Activity';
export const { GET, POST } = createCrudRoutes(Activity, { searchFields: ['title', 'slug'] });
