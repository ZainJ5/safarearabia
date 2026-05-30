import { createCrudRoutes } from '@/lib/adminCrud';
import VisaCategory from '@/models/VisaCategory';
export const { GET, POST } = createCrudRoutes(VisaCategory, { searchFields: ['name', 'slug'] });
