import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

const prisma = new PrismaClient();

const createCourseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  code: z.string().min(1, 'Course code is required'),
  imageUrl: z.string().optional(),
  category: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// GET /api/courses - Get all courses
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const teacherId = searchParams.get('teacherId');

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (teacherId) {
      where.teacherId = teacherId;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        enrollments: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            isPublished: true,
          },
        },
        assignments: {
          select: {
            id: true,
            title: true,
            dueDate: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            assignments: true,
            quizzes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createCourseSchema.parse(body);

    // Check if user is a teacher
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can create courses' },
        { status: 403 }
      );
    }

    // Check if course code is unique
    const existingCourse = await prisma.course.findUnique({
      where: { code: validatedData.code },
    });

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course code already exists' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        ...validatedData,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        teacherId: user.id,
      },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
            assignments: true,
            quizzes: true,
          },
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
