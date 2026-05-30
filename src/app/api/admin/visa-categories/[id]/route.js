import { createCrudDetailRoutes } from '@/lib/adminCrud';
import VisaCategory from '@/models/VisaCategory';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(VisaCategory);
