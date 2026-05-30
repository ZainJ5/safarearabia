import { createCrudRoutes } from '@/lib/adminCrud';
import Hotel from '@/models/Hotel';
export const { GET, POST } = createCrudRoutes(Hotel, { searchFields: ['title', 'slug'] });
