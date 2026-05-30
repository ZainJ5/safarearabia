import { createCrudDetailRoutes } from '@/lib/adminCrud';
import Activity from '@/models/Activity';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(Activity);
