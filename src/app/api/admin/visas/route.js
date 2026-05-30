import { createCrudRoutes } from '@/lib/adminCrud';
import Visa from '@/models/Visa';
export const { GET, POST } = createCrudRoutes(Visa, { searchFields: ['title', 'slug'] });
