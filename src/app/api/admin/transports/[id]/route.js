import { createCrudDetailRoutes } from '@/lib/adminCrud';
import Transport from '@/models/Transport';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(Transport);
