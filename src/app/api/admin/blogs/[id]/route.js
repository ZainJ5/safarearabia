import { createCrudDetailRoutes } from '@/lib/adminCrud';
import Blog from '@/models/Blog';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(Blog);
