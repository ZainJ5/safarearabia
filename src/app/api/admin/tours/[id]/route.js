import { createCrudDetailRoutes } from '@/lib/adminCrud';
import Tour from '@/models/Tour';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(Tour);
