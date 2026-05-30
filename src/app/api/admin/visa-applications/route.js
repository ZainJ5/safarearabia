import { createCrudRoutes } from '@/lib/adminCrud';
import VisaApplication from '@/models/VisaApplication';
export const { GET, POST } = createCrudRoutes(VisaApplication, { searchFields: ['name', 'email', 'visa_title'] });
