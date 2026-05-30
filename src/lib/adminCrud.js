import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';

/**
 * Creates standard CRUD route handlers for admin API routes.
 * 
 * Usage:
 *   import { createCrudRoutes } from '@/lib/adminCrud';
 *   import Tour from '@/models/Tour';
 *   const { GET, POST } = createCrudRoutes(Tour);
 *   export { GET, POST };
 */

async function checkAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 1) {
    return null;
  }
  return session;
}

export function createCrudRoutes(Model, options = {}) {
  const { defaultSort = { created_at: -1 }, searchFields = ['title'] } = options;

  return {
    async GET(request) {
      try {
        const session = await checkAdmin();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status');
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
          query.$or = searchFields.map(f => ({ [f]: { $regex: search, $options: 'i' } }));
        }
        if (status) query.status = parseInt(status);

        const [items, total] = await Promise.all([
          Model.find(query).sort(defaultSort).skip(skip).limit(limit).lean(),
          Model.countDocuments(query),
        ]);

        return NextResponse.json({
          success: true,
          data: items,
          pagination: { total, page, pages: Math.ceil(total / limit), limit },
        });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async POST(request) {
      try {
        const session = await checkAdmin();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const body = await request.json();
        const item = await Model.create(body);

        return NextResponse.json({ success: true, data: item }, { status: 201 });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },
  };
}

export function createCrudDetailRoutes(Model) {
  return {
    async GET(request, { params }) {
      try {
        const session = await checkAdmin();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        const item = await Model.findById(id).lean();
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: item });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async PUT(request, { params }) {
      try {
        const session = await checkAdmin();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        const body = await request.json();
        
        delete body.author_id;
        delete body._id;
        delete body.created_at;
        delete body.updated_at;
        
        const item = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: item });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async DELETE(request, { params }) {
      try {
        const session = await checkAdmin();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();
        const { id } = await params;
        const item = await Model.findByIdAndDelete(id);
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },
  };
}
