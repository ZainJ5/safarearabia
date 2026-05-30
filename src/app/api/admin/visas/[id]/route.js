import { createCrudDetailRoutes } from '@/lib/adminCrud';
import Visa from '@/models/Visa';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(Visa);
