import { createCrudDetailRoutes } from '@/lib/adminCrud';
import VisaApplication from '@/models/VisaApplication';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(VisaApplication);
