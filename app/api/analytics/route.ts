import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

const prisma = new PrismaClient();

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'overview', 'course', 'student', 'leaderboard'
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');
    const period = searchParams.get('period') || '30'; // days

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    let analyticsData: any = {};

    switch (type) {
      case 'overview':
        analyticsData = await getOverviewAnalytics(user.id, user.role, startDate);
        break;
      case 'course':
        if (!courseId) {
          return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
        }
        analyticsData = await getCourseAnalytics(courseId, user.id, user.role);
        break;
      case 'student':
        if (!studentId && user.role === 'TEACHER') {
          return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
        }
        analyticsData = await getStudentAnalytics(studentId || user.id, user.role);
        break;
      case 'leaderboard':
        if (!courseId) {
          return NextResponse.json({ error: 'Course ID required' }, { status: 400 });
        }
        analyticsData = await getLeaderboardData(courseId, user.id, user.role);
        break;
      default:
        return NextResponse.json({ error: 'Invalid analytics type' }, { status: 400 });
    }

    return NextResponse.json({ analytics: analyticsData });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getOverviewAnalytics(userId: string, userRole: string, startDate: Date) {
  const baseStats = {
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    averageGrade: 0,
    completionRate: 0,
    activityData: [],
    performanceTrends: [],
  };

  if (userRole === 'TEACHER') {
    // Teacher analytics
    const [courses, assignments, submissions, grades] = await Promise.all([
      prisma.course.findMany({
        where: { teacherId: userId },
        include: { _count: { select: { enrollments: true } } },
      }),
      prisma.assignment.findMany({
        where: { teacherId: userId },
        include: { _count: { select: { submissions: true } } },
      }),
      prisma.submission.findMany({
        where: { assignment: { teacherId: userId } },
        include: { grade: true },
      }),
      prisma.grade.findMany({
        where: { submission: { assignment: { teacherId: userId } } },
        where: { gradedAt: { gte: startDate } },
      }),
    ]);

    const totalStudents = courses.reduce((sum, course) => sum + course._count.enrollments, 0);
    const totalSubmissions = assignments.reduce((sum, assignment) => sum + assignment._count.submissions, 0);
    const gradedSubmissions = submissions.filter(s => s.grade).length;
    const averageGrade = grades.length > 0 
      ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length 
      : 0;

    // Activity data for the last 7 days
    const activityData = await getTeacherActivityData(userId, 7);

    baseStats.totalCourses = courses.length;
    baseStats.totalStudents = totalStudents;
    baseStats.totalAssignments = assignments.length;
    baseStats.averageGrade = Math.round(averageGrade * 100) / 100;
    baseStats.completionRate = totalSubmissions > 0 ? (gradedSubmissions / totalSubmissions) * 100 : 0;
    baseStats.activityData = activityData;

  } else if (userRole === 'STUDENT') {
    // Student analytics
    const [enrollments, submissions, grades, quizAttempts] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { course: true },
      }),
      prisma.submission.findMany({
        where: { studentId: userId },
        include: { grade: true, assignment: { include: { course: true } } },
      }),
      prisma.grade.findMany({
        where: { studentId: userId, gradedAt: { gte: startDate } },
      }),
      prisma.quizAttempt.findMany({
        where: { studentId: userId, status: 'COMPLETED' },
        include: { quiz: { include: { course: true } } },
      }),
    ]);

    const totalAssignments = submissions.length;
    const completedAssignments = submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'GRADED').length;
    const averageGrade = grades.length > 0 
      ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length 
      : 0;

    // Activity data for the last 7 days
    const activityData = await getStudentActivityData(userId, 7);

    baseStats.totalCourses = enrollments.length;
    baseStats.totalAssignments = totalAssignments;
    baseStats.averageGrade = Math.round(averageGrade * 100) / 100;
    baseStats.completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;
    baseStats.activityData = activityData;
  }

  return baseStats;
}

async function getCourseAnalytics(courseId: string, userId: string, userRole: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      enrollments: {
        include: { user: { select: { id: true, fullName: true, email: true } } },
      },
      assignments: {
        include: { 
          submissions: { 
            include: { 
              grade: true, 
              student: { select: { id: true, fullName: true } } 
            } 
          } 
        },
      },
      quizzes: {
        include: {
          quizAttempts: {
            include: { student: { select: { id: true, fullName: true } } },
          },
        },
      },
      attendance: {
        include: { student: { select: { id: true, fullName: true } } },
      },
    },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check access permissions
  if (userRole === 'TEACHER' && course.teacherId !== userId) {
    throw new Error('Access denied');
  }

  if (userRole === 'STUDENT') {
    const enrollment = course.enrollments.find(e => e.userId === userId);
    if (!enrollment) {
      throw new Error('Not enrolled in this course');
    }
  }

  const enrolledStudents = course.enrollments.filter(e => e.status === 'ACTIVE');
  const totalAssignments = course.assignments.length;
  const totalQuizzes = course.quizzes.length;

  // Calculate assignment completion rate
  const assignmentSubmissions = course.assignments.flatMap(a => a.submissions);
  const expectedSubmissions = totalAssignments * enrolledStudents.length;
  const actualSubmissions = assignmentSubmissions.length;
  const assignmentCompletionRate = expectedSubmissions > 0 ? (actualSubmissions / expectedSubmissions) * 100 : 0;

  // Calculate average grade
  const gradedSubmissions = assignmentSubmissions.filter(s => s.grade);
  const averageGrade = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + s.grade!.percentage, 0) / gradedSubmissions.length
    : 0;

  // Calculate quiz performance
  const quizAttempts = course.quizzes.flatMap(q => q.quizAttempts.filter(a => a.status === 'COMPLETED'));
  const averageQuizScore = quizAttempts.length > 0
    ? quizAttempts.reduce((sum, a) => sum + ((a.score || 0) / a.maxScore) * 100, 0) / quizAttempts.length
    : 0;

  // Calculate attendance rate
  const attendanceRecords = course.attendance;
  const presentRecords = attendanceRecords.filter(a => a.status === 'PRESENT').length;
  const attendanceRate = attendanceRecords.length > 0 ? (presentRecords / attendanceRecords.length) * 100 : 0;

  // Student performance data
  const studentPerformance = enrolledStudents.map(enrollment => {
    const student = enrollment.user;
    const studentSubmissions = assignmentSubmissions.filter(s => s.student.id === student.id);
    const studentQuizAttempts = quizAttempts.filter(a => a.student.id === student.id);
    const studentAttendance = attendanceRecords.filter(a => a.student.id === student.id);

    const gradedStudentSubmissions = studentSubmissions.filter(s => s.grade);
    const studentAverage = gradedStudentSubmissions.length > 0
      ? gradedStudentSubmissions.reduce((sum, s) => sum + s.grade!.percentage, 0) / gradedStudentSubmissions.length
      : 0;

    const studentQuizAverage = studentQuizAttempts.length > 0
      ? studentQuizAttempts.reduce((sum, a) => sum + ((a.score || 0) / a.maxScore) * 100, 0) / studentQuizAttempts.length
      : 0;

    const studentPresentRecords = studentAttendance.filter(a => a.status === 'PRESENT').length;
    const studentAttendanceRate = studentAttendance.length > 0 ? (studentPresentRecords / studentAttendance.length) * 100 : 0;

    return {
      id: student.id,
      name: student.fullName,
      email: student.email,
      assignmentAverage: Math.round(studentAverage * 100) / 100,
      quizAverage: Math.round(studentQuizAverage * 100) / 100,
      attendanceRate: Math.round(studentAttendanceRate * 100) / 100,
      submissionsCount: studentSubmissions.length,
      totalAssignments,
    };
  });

  return {
    courseInfo: {
      id: course.id,
      title: course.title,
      code: course.code,
      description: course.description,
    },
    summary: {
      totalStudents: enrolledStudents.length,
      totalAssignments,
      totalQuizzes,
      assignmentCompletionRate: Math.round(assignmentCompletionRate * 100) / 100,
      averageGrade: Math.round(averageGrade * 100) / 100,
      averageQuizScore: Math.round(averageQuizScore * 100) / 100,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
    },
    studentPerformance,
  };
}

async function getStudentAnalytics(studentId: string, userRole: string) {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      enrollments: {
        include: { 
          course: { 
            select: { 
              id: true, 
              title: true, 
              code: true, 
              teacher: { select: { fullName: true } } 
            } 
          } 
        },
      },
      submissions: {
        include: { 
          grade: true, 
          assignment: { 
            include: { 
              course: { select: { title: true } } 
            } 
          } 
        },
      },
      quizAttempts: {
        where: { status: 'COMPLETED' },
        include: { 
          quiz: { 
            include: { 
              course: { select: { title: true } } 
            } 
          } 
        },
      },
      attendanceRecords: {
        include: { 
          course: { select: { title: true } } 
        },
      },
      grades: {
        include: { 
          submission: { 
            include: { 
              assignment: { 
                include: { 
                  course: { select: { title: true } } 
                } 
              } 
            } 
          } 
        },
      },
    },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  const enrolledCourses = student.enrollments.filter(e => e.status === 'ACTIVE');
  const totalSubmissions = student.submissions.length;
  const gradedSubmissions = student.submissions.filter(s => s.grade);
  const completedQuizzes = student.quizAttempts.length;

  // Calculate overall GPA
  const overallGPA = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + s.grade!.percentage, 0) / gradedSubmissions.length
    : 0;

  // Calculate quiz average
  const quizAverage = completedQuizzes > 0
    ? student.quizAttempts.reduce((sum, a) => sum + ((a.score || 0) / a.maxScore) * 100, 0) / completedQuizzes
    : 0;

  // Calculate attendance rate
  const attendanceRecords = student.attendanceRecords;
  const presentRecords = attendanceRecords.filter(a => a.status === 'PRESENT').length;
  const attendanceRate = attendanceRecords.length > 0 ? (presentRecords / attendanceRecords.length) * 100 : 0;

  // Course-wise performance
  const coursePerformance = enrolledCourses.map(enrollment => {
    const course = enrollment.course;
    const courseSubmissions = student.submissions.filter(s => s.assignment.course.title === course.title);
    const courseQuizzes = student.quizAttempts.filter(a => a.quiz.course.title === course.title);
    const courseAttendance = attendanceRecords.filter(a => a.course.title === course.title);

    const gradedCourseSubmissions = courseSubmissions.filter(s => s.grade);
    const courseAverage = gradedCourseSubmissions.length > 0
      ? gradedCourseSubmissions.reduce((sum, s) => sum + s.grade!.percentage, 0) / gradedCourseSubmissions.length
      : 0;

    const courseQuizAverage = courseQuizzes.length > 0
      ? courseQuizzes.reduce((sum, a) => sum + ((a.score || 0) / a.maxScore) * 100, 0) / courseQuizzes.length
      : 0;

    const coursePresentRecords = courseAttendance.filter(a => a.status === 'PRESENT').length;
    const courseAttendanceRate = courseAttendance.length > 0 ? (coursePresentRecords / courseAttendance.length) * 100 : 0;

    return {
      courseId: course.id,
      courseTitle: course.title,
      courseCode: course.code,
      teacher: course.teacher.fullName,
      assignmentAverage: Math.round(courseAverage * 100) / 100,
      quizAverage: Math.round(courseQuizAverage * 100) / 100,
      attendanceRate: Math.round(courseAttendanceRate * 100) / 100,
      submissionsCount: courseSubmissions.length,
      quizzesCount: courseQuizzes.length,
    };
  });

  return {
    studentInfo: {
      id: student.id,
      name: student.fullName,
      email: student.email,
      grade: student.grade,
    },
    summary: {
      enrolledCourses: enrolledCourses.length,
      totalSubmissions,
      gradedSubmissions: gradedSubmissions.length,
      completedQuizzes,
      overallGPA: Math.round(overallGPA * 100) / 100,
      quizAverage: Math.round(quizAverage * 100) / 100,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
    },
    coursePerformance,
  };
}

async function getLeaderboardData(courseId: string, userId: string, userRole: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      enrollments: {
        where: { status: 'ACTIVE' },
        include: { 
          user: { 
            select: { 
              id: true, 
              fullName: true, 
              email: true 
            } 
          } 
        },
      },
    },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  // Check access permissions
  if (userRole === 'TEACHER' && course.teacherId !== userId) {
    throw new Error('Access denied');
  }

  if (userRole === 'STUDENT') {
    const enrollment = course.enrollments.find(e => e.user.id === userId);
    if (!enrollment) {
      throw new Error('Not enrolled in this course');
    }
  }

  // Get leaderboard data for each student
  const leaderboardData = await Promise.all(
    course.enrollments.map(async (enrollment) => {
      const student = enrollment.user;

      // Get student's submissions for this course
      const submissions = await prisma.submission.findMany({
        where: {
          studentId: student.id,
          assignment: { courseId },
          status: { in: ['SUBMITTED', 'GRADED'] },
        },
        include: { grade: true },
      });

      // Get student's quiz attempts for this course
      const quizAttempts = await prisma.quizAttempt.findMany({
        where: {
          studentId: student.id,
          quiz: { courseId },
          status: 'COMPLETED',
        },
      });

      // Get student's attendance for this course
      const attendanceRecords = await prisma.attendance.findMany({
        where: {
          studentId: student.id,
          courseId,
        },
      });

      // Calculate scores
      const gradedSubmissions = submissions.filter(s => s.grade);
      const assignmentAverage = gradedSubmissions.length > 0
        ? gradedSubmissions.reduce((sum, s) => sum + s.grade!.percentage, 0) / gradedSubmissions.length
        : 0;

      const quizAverage = quizAttempts.length > 0
        ? quizAttempts.reduce((sum, a) => sum + ((a.score || 0) / a.maxScore) * 100, 0) / quizAttempts.length
        : 0;

      const presentRecords = attendanceRecords.filter(a => a.status === 'PRESENT').length;
      const attendanceRate = attendanceRecords.length > 0 ? (presentRecords / attendanceRecords.length) * 100 : 0;

      // Calculate overall score (weighted average)
      const overallScore = (assignmentAverage * 0.6) + (quizAverage * 0.3) + (attendanceRate * 0.1);

      // Calculate participation points
      const participationPoints = submissions.length * 10 + quizAttempts.length * 15 + presentRecords * 5;

      return {
        studentId: student.id,
        name: student.fullName,
        email: userRole === 'TEACHER' ? student.email : undefined,
        assignmentAverage: Math.round(assignmentAverage * 100) / 100,
        quizAverage: Math.round(quizAverage * 100) / 100,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        overallScore: Math.round(overallScore * 100) / 100,
        participationPoints,
        submissionsCount: submissions.length,
        quizzesCount: quizAttempts.length,
        attendanceCount: presentRecords,
      };
    })
  );

  // Sort by overall score (descending)
  leaderboardData.sort((a, b) => b.overallScore - a.overallScore);

  // Add rankings
  const rankedLeaderboard = leaderboardData.map((student, index) => ({
    ...student,
    rank: index + 1,
  }));

  return {
    courseInfo: {
      id: course.id,
      title: course.title,
      code: course.code,
    },
    leaderboard: rankedLeaderboard,
    totalStudents: course.enrollments.length,
  };
}

async function getTeacherActivityData(teacherId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get daily activity counts
  const activities = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const [assignments, grades, announcements] = await Promise.all([
      prisma.assignment.count({
        where: {
          teacherId,
          createdAt: { gte: date, lt: nextDate },
        },
      }),
      prisma.grade.count({
        where: {
          submission: { assignment: { teacherId } },
          gradedAt: { gte: date, lt: nextDate },
        },
      }),
      prisma.announcement.count({
        where: {
          authorId: teacherId,
          createdAt: { gte: date, lt: nextDate },
        },
      }),
    ]);

    activities.push({
      date: date.toISOString().split('T')[0],
      assignments,
      grades,
      announcements,
      total: assignments + grades + announcements,
    });
  }

  return activities;
}

async function getStudentActivityData(studentId: string, days: number) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get daily activity counts
  const activities = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const [submissions, quizAttempts, discussionPosts] = await Promise.all([
      prisma.submission.count({
        where: {
          studentId,
          submittedAt: { gte: date, lt: nextDate },
        },
      }),
      prisma.quizAttempt.count({
        where: {
          studentId,
          startedAt: { gte: date, lt: nextDate },
        },
      }),
      prisma.discussionPost.count({
        where: {
          authorId: studentId,
          createdAt: { gte: date, lt: nextDate },
        },
      }),
    ]);

    activities.push({
      date: date.toISOString().split('T')[0],
      submissions,
      quizzes: quizAttempts,
      discussions: discussionPosts,
      total: submissions + quizAttempts + discussionPosts,
    });
  }

  return activities;
}
