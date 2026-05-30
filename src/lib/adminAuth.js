import { auth } from '@/lib/auth';

/**
 * Verify the current request is from an authenticated admin (role === 1).
 * Use in API routes: const session = await requireAdmin();
 * Throws a Response if not authorized.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    throw new Response(JSON.stringify({ error: 'Authentication required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (session.user.role !== 1) {
    throw new Response(JSON.stringify({ error: 'Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return session;
}

/**
 * Wrapper for admin API route handlers.
 * Catches auth errors and returns proper JSON responses.
 */
export function withAdmin(handler) {
  return async function (request, context) {
    try {
      const session = await requireAdmin();
      return handler(request, context, session);
    } catch (error) {
      if (error instanceof Response) {
        return error;
      }
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}
