import { createCrudRoutes } from '@/lib/adminCrud';
import TransportInquiry from '@/models/TransportInquiry';
export const { GET, POST } = createCrudRoutes(TransportInquiry, { searchFields: ['name', 'email', 'transport_title'] });
