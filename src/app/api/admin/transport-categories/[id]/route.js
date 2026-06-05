import { createCrudDetailRoutes } from '@/lib/adminCrud';
import TransportCategory from '@/models/TransportCategory';

export const { GET, PUT, DELETE } = createCrudDetailRoutes(TransportCategory, { allowAgent: true });
