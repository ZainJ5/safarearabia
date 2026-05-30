import { createCrudRoutes } from '@/lib/adminCrud';
import Blog from '@/models/Blog';
export const { GET, POST } = createCrudRoutes(Blog, { searchFields: ['title', 'slug'] });
