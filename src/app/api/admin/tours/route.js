import { createCrudRoutes } from '@/lib/adminCrud';
import Tour from '@/models/Tour';
export const { GET, POST } = createCrudRoutes(Tour, { searchFields: ['title', 'slug'] });
