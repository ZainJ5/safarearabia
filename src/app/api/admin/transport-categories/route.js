import { createCrudRoutes } from '@/lib/adminCrud';
import TransportCategory from '@/models/TransportCategory';

export const { GET, POST } = createCrudRoutes(TransportCategory, {
  searchFields: ['name', 'slug'],
});
