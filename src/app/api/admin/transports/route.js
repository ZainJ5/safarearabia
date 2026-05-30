import { createCrudRoutes } from '@/lib/adminCrud';
import Transport from '@/models/Transport';
export const { GET, POST } = createCrudRoutes(Transport, { searchFields: ['title', 'slug'] });
