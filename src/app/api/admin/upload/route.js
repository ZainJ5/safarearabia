import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '');
    const timestamp = Date.now();
    const fileName = `${baseName}-${timestamp}${ext}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', folder);
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/${folder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url,
      fileName,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
