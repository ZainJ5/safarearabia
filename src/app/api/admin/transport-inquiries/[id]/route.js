import { createCrudDetailRoutes } from '@/lib/adminCrud';
import TransportInquiry from '@/models/TransportInquiry';
export const { GET, PUT, DELETE } = createCrudDetailRoutes(TransportInquiry);
