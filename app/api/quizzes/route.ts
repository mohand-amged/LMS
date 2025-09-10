import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

const prisma = new PrismaClient();

const questionSchema = z.object({
  type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY', 'FILL_IN_BLANK']),
  question: z.string().min(1, 'Question is required'),
  options: z.string(), // JSON string for options
  correctAnswer: z.string(), // JSON string for correct answer(s)
  points: z.number().min(1, 'Points must be at least 1'),
  order: z.number(),
});

const createQuizSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  courseId: z.string().min(1, 'Course ID is required'),
  timeLimit: z.number().optional(),
  attempts: z.number().min(1, 'Must allow at least 1 attempt'),
  randomize: z.boolean().default(false),
  showResults: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  questions: z.array(questionSchema),
});

// GET /api/quizzes - Get all quizzes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('courseId');
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

    // If user is a student, only show published quizzes from enrolled courses
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

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        questions: {
          select: {
            id: true,
            type: true,
            question: user.role === 'TEACHER',
            options: user.role === 'TEACHER',
            correctAnswer: user.role === 'TEACHER',
            points: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
        quizAttempts: user.role === 'STUDENT' ? {
          where: { studentId: user.id },
          select: {
            id: true,
            score: true,
            maxScore: true,
            status: true,
            startedAt: true,
            completedAt: true,
          },
          orderBy: { startedAt: 'desc' },
        } : {
          select: {
            id: true,
            score: true,
            maxScore: true,
            status: true,
            student: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            questions: true,
            quizAttempts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/quizzes - Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createQuizSchema.parse(body);

    // Check if user is a teacher
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user || user.role !== 'TEACHER') {
      return NextResponse.json(
        { error: 'Only teachers can create quizzes' },
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

    // Create quiz with questions in a transaction
    const quiz = await prisma.$transaction(async (tx) => {
      const newQuiz = await tx.quiz.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          courseId: validatedData.courseId,
          timeLimit: validatedData.timeLimit,
          attempts: validatedData.attempts,
          randomize: validatedData.randomize,
          showResults: validatedData.showResults,
          isPublished: validatedData.isPublished,
        },
      });

      // Create questions
      const questions = await Promise.all(
        validatedData.questions.map((questionData) =>
          tx.question.create({
            data: {
              ...questionData,
              quizId: newQuiz.id,
            },
          })
        )
      );

      return { ...newQuiz, questions };
    });

    // If quiz is published, create notifications for enrolled students
    if (validatedData.isPublished) {
      const enrolledStudents = await prisma.enrollment.findMany({
        where: { 
          courseId: validatedData.courseId,
          status: 'ACTIVE',
        },
        select: { userId: true },
      });

      const notifications = enrolledStudents.map(enrollment => ({
        title: 'New Quiz Available',
        content: `New quiz "${quiz.title}" is now available in ${course.title}`,
        type: 'ASSIGNMENT' as const,
        userId: enrollment.userId,
      }));

      await prisma.notification.createMany({
        data: notifications,
      });
    }

    // Fetch the complete quiz with relations for response
    const completeQuiz = await prisma.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        questions: {
          select: {
            id: true,
            type: true,
            question: true,
            options: true,
            points: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            questions: true,
            quizAttempts: true,
          },
        },
      },
    });

    return NextResponse.json({ quiz: completeQuiz }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
