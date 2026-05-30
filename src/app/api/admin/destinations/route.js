import { createCrudRoutes } from '@/lib/adminCrud';
import Destination from '@/models/Destination';
export const { GET, POST } = createCrudRoutes(Destination, { searchFields: ['title', 'slug'] });
