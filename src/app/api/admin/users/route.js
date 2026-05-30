import { createCrudRoutes } from '@/lib/adminCrud';
import User from '@/models/User';
export const { GET, POST } = createCrudRoutes(User, { searchFields: ['fname', 'lname', 'email', 'phone'] });
