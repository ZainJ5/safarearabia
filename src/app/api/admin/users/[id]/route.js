import { createCrudDetailRoutes } from '@/lib/adminCrud';
import User from '@/models/User';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(User);
