import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

const prisma = new PrismaClient();

const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  courseId: z.string().min(1, 'Course ID is required'),
  type: z.enum(['ESSAY', 'MULTIPLE_CHOICE', 'PROJECT', 'PRESENTATION', 'LAB', 'OTHER']),
  maxPoints: z.number().min(1, 'Max points must be at least 1'),
  dueDate: z.string().min(1, 'Due date is required'),
  isPublished: z.boolean().default(false),
});

// GET /api/assignments - Get all assignments
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');
    const isPublished = searchParams.get('isPublished');

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const where: any = {};
    
    if (courseId) {
      where.courseId = courseId;
    }
    
    if (isPublished !== null) {
      where.isPublished = isPublished === 'true';
    }

    // If user is a student, only show published assignments from enrolled courses
    if (user.role === 'STUDENT') {
      const enrolledCourses = await prisma.enrollment.findMany({
        where: { 
          userId: user.id, 
          status: 'ACTIVE' 
        },
        select: { courseId: true },
      });
      
      where.courseId = { in: enrolledCourses.map(e => e.courseId) };
      where.isPublished = true;
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        submissions: user.role === 'STUDENT' ? {
          where: { studentId: user.id },
          select: {
            id: true,
            status: true,
            submittedAt: true,
            grade: {
              select: {
                score: true,
                maxScore: true,
                percentage: true,
                feedback: true,
              },
            },
          },
        } : {
          select: {
            id: true,
            status: true,
            submittedAt: true,
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            grade: {
              select: {
                score: true,
                maxScore: true,
                percentage: true,
              },
            },
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/assignments - Create a new assignment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createAssignmentSchema.parse(body);

    // Check if user is a teacher
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can create assignments' },
        { status: 403 }
      );
    }

    // Verify that the teacher owns the course
    const course = await prisma.course.findUnique({
      where: { 
        id: validatedData.courseId,
        teacherId: user.id,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found or access denied' },
        { status: 404 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        ...validatedData,
        dueDate: new Date(validatedData.dueDate),
        teacherId: user.id,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        teacher: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
    });

    // If assignment is published, create notifications for enrolled students
    if (validatedData.isPublished) {
      const enrolledStudents = await prisma.enrollment.findMany({
        where: { 
          courseId: validatedData.courseId,
          status: 'ACTIVE',
        },
        select: { userId: true },
      });

      const notifications = enrolledStudents.map(enrollment => ({
        title: 'New Assignment Posted',
        content: `New assignment "${assignment.title}" has been posted in ${course.title}`,
        type: 'ASSIGNMENT' as const,
        userId: enrollment.userId,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });
    }

    return NextResponse.json({ assignment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
