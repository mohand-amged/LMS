import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default

// Allowed file types for different categories
const ALLOWED_TYPES = {
  document: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt'],
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  video: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
  audio: ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
  archive: ['.zip', '.rar', '.7z', '.tar', '.gz'],
};

const ALL_ALLOWED_EXTENSIONS = [
  ...ALLOWED_TYPES.document,
  ...ALLOWED_TYPES.image,
  ...ALLOWED_TYPES.video,
  ...ALLOWED_TYPES.audio,
  ...ALLOWED_TYPES.archive,
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'document';
    const courseId = formData.get('courseId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file extension
    const fileExtension = extname(file.name).toLowerCase();
    if (!ALL_ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: `File type ${fileExtension} not allowed` },
        { status: 400 }
      );
    }

    // Determine file category based on extension
    let fileCategory = category;
    for (const [cat, extensions] of Object.entries(ALLOWED_TYPES)) {
      if (extensions.includes(fileExtension)) {
        fileCategory = cat;
        break;
      }
    }

    // Create upload directory if it doesn't exist
    const uploadPath = join(process.cwd(), UPLOAD_DIR);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Create subdirectory for the category
    const categoryPath = join(uploadPath, fileCategory);
    if (!existsSync(categoryPath)) {
      await mkdir(categoryPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const uniqueFileName = `${timestamp}-${randomString}${fileExtension}`;
    const filePath = join(categoryPath, uniqueFileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Store file metadata (you might want to save this to database)
    const fileMetadata = {
      id: `${timestamp}-${randomString}`,
      originalName: file.name,
      fileName: uniqueFileName,
      filePath: `${UPLOAD_DIR}/${fileCategory}/${uniqueFileName}`,
      size: file.size,
      mimeType: file.type,
      category: fileCategory,
      uploadedBy: session.user.email,
      courseId: courseId || null,
      uploadedAt: new Date().toISOString(),
      url: `/api/files/${fileCategory}/${uniqueFileName}`,
    };

    return NextResponse.json({
      success: true,
      file: fileMetadata,
      message: 'File uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Internal server error during file upload' },
      { status: 500 }
    );
  }
}

// GET endpoint to list uploaded files
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const courseId = searchParams.get('courseId');

    // In a real application, you would fetch this from your database
    // For now, we'll return a placeholder response
    const files = [];

    return NextResponse.json({
      files,
      total: files.length,
      categories: Object.keys(ALLOWED_TYPES),
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
