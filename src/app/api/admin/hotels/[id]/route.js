import { createCrudDetailRoutes } from '@/lib/adminCrud';
import Hotel from '@/models/Hotel';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(Hotel);
