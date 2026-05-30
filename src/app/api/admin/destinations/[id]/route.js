import { createCrudDetailRoutes } from '@/lib/adminCrud';
import Destination from '@/models/Destination';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(Destination);
