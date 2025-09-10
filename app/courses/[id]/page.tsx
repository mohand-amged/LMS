'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Play, Book, Users, Calendar, Settings, Plus, Edit, Eye } from 'lucide-react';
import Link from 'next/link';
import { Course, Lesson, UserRole, LessonType, CourseStatus } from '../../types';

export default function CourseDetailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);

  // Mock data for course and lessons
  useEffect(() => {
    if (user && courseId) {
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Introduction to Mathematics',
          description: 'This comprehensive course covers basic mathematical concepts and operations for beginners. Students will learn fundamental algebra, geometry, and problem-solving techniques that form the foundation for advanced mathematical studies.',
          code: 'MATH101',
          imageUrl: '/api/placeholder/800/400',
          category: 'Mathematics',
          status: CourseStatus.PUBLISHED,
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-05-15'),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
          teacherId: user.role === UserRole.TEACHER ? user.id : 'demo-teacher-1',
          teacher: {
            id: 'demo-teacher-1',
            fullName: 'John Smith',
            username: 'jsmith',
            email: 'teacher@example.com',
            role: UserRole.TEACHER,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        {
          id: '2',
          title: 'English Literature',
          description: 'Explore classic and contemporary literature through critical analysis and discussion.',
          code: 'ENG201',
          category: 'English',
          status: CourseStatus.PUBLISHED,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-06-01'),
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
          teacherId: user.role === UserRole.TEACHER ? user.id : 'demo-teacher-1',
          teacher: {
            id: 'demo-teacher-1',
            fullName: 'John Smith',
            username: 'jsmith',
            email: 'teacher@example.com',
            role: UserRole.TEACHER,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      ];

      const foundCourse = mockCourses.find(c => c.id === courseId);
      setCourse(foundCourse || null);

      if (foundCourse) {
        const mockLessons: Lesson[] = [
          {
            id: '1',
            title: 'Introduction to Basic Algebra',
            description: 'Learn the fundamentals of algebraic expressions and equations.',
            content: JSON.stringify([
              { type: 'text', data: 'Welcome to our first lesson on algebra. In this lesson, we will explore the basic concepts of algebraic expressions.' },
              { type: 'text', data: 'An algebraic expression is a mathematical phrase that contains variables, numbers, and operations.' }
            ]),
            type: LessonType.TEXT,
            order: 1,
            duration: 30,
            isPublished: true,
            createdAt: new Date('2024-01-02'),
            updatedAt: new Date('2024-01-02'),
            courseId: foundCourse.id
          },
          {
            id: '2',
            title: 'Solving Linear Equations',
            description: 'Step-by-step guide to solving linear equations with one variable.',
            content: JSON.stringify([
              { type: 'text', data: 'Linear equations are equations where the highest power of the variable is 1.' },
              { type: 'text', data: 'To solve a linear equation, we need to isolate the variable on one side of the equation.' }
            ]),
            type: LessonType.VIDEO,
            order: 2,
            duration: 45,
            videoUrl: 'https://www.example.com/video1',
            isPublished: true,
            createdAt: new Date('2024-01-05'),
            updatedAt: new Date('2024-01-05'),
            courseId: foundCourse.id
          },
          {
            id: '3',
            title: 'Graphing Linear Functions',
            description: 'Understanding how to plot and interpret linear functions on a coordinate plane.',
            content: JSON.stringify([
              { type: 'text', data: 'A linear function creates a straight line when graphed on a coordinate plane.' }
            ]),
            type: LessonType.PRESENTATION,
            order: 3,
            duration: 40,
            isPublished: false,
            createdAt: new Date('2024-01-10'),
            updatedAt: new Date('2024-01-10'),
            courseId: foundCourse.id
          }
        ];

        // Filter lessons based on user role
        if (user.role === UserRole.TEACHER && foundCourse.teacherId === user.id) {
          setLessons(mockLessons);
        } else {
          setLessons(mockLessons.filter(lesson => lesson.isPublished));
        }

        // Check if student is enrolled (mock)
        setIsEnrolled(user.role === UserRole.STUDENT);
      }
    }
  }, [user, courseId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleEnroll = async () => {
    if (!course || user?.role !== UserRole.STUDENT) return;

    setEnrollmentLoading(true);
    try {
      // Mock enrollment API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      alert('Failed to enroll. Please try again.');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO:
        return <Play className="h-4 w-4 text-red-600" />;
      case LessonType.TEXT:
        return <Book className="h-4 w-4 text-blue-600" />;
      case LessonType.PRESENTATION:
        return <Settings className="h-4 w-4 text-purple-600" />;
      default:
        return <Book className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.PUBLISHED:
        return <Badge variant="success">Published</Badge>;
      case CourseStatus.DRAFT:
        return <Badge variant="warning">Draft</Badge>;
      case CourseStatus.ARCHIVED:
        return <Badge variant="secondary">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href="/courses" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Courses
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
            <Link href="/courses">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isTeacher = user.role === UserRole.TEACHER && course.teacherId === user.id;
  const canViewContent = isTeacher || isEnrolled;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/courses" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Courses
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">{course.title}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.fullName}
              </span>
              {isTeacher && (
                <Link href={`/courses/${course.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Manage Course
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                {getStatusBadge(course.status)}
              </div>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Instructor: {course.teacher?.fullName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Code: {course.code}</span>
                </div>
                {course.category && (
                  <div className="flex items-center">
                    <Book className="h-4 w-4 mr-2" />
                    <span>Category: {course.category}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {course.startDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">Start Date</h3>
                        <p className="text-sm text-gray-900">{course.startDate.toLocaleDateString()}</p>
                      </div>
                    )}
                    {course.endDate && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700">End Date</h3>
                        <p className="text-sm text-gray-900">{course.endDate.toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700">Lessons</h3>
                      <p className="text-sm text-gray-900">{lessons.filter(l => l.isPublished || isTeacher).length} lessons</p>
                    </div>
                    
                    {!isTeacher && !isEnrolled && course.status === CourseStatus.PUBLISHED && (
                      <Button 
                        onClick={handleEnroll} 
                        disabled={enrollmentLoading}
                        className="w-full"
                      >
                        {enrollmentLoading ? 'Enrolling...' : 'Enroll in Course'}
                      </Button>
                    )}
                    
                    {isEnrolled && !isTeacher && (
                      <div className="text-center py-2">
                        <Badge variant="success">Enrolled</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
            {isTeacher && (
              <Link href={`/courses/${course.id}/lessons/create`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </Link>
            )}
          </div>

          {!canViewContent ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Enrollment Required</h3>
                  <p className="text-gray-600 mb-4">
                    You need to enroll in this course to view the lessons and content.
                  </p>
                  {course.status === CourseStatus.PUBLISHED && (
                    <Button onClick={handleEnroll} disabled={enrollmentLoading}>
                      {enrollmentLoading ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {lessons.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Lessons Yet</h3>
                      <p className="text-gray-600 mb-4">
                        {isTeacher 
                          ? 'Start building your course by adding the first lesson.'
                          : 'The instructor hasn\'t added any lessons to this course yet.'
                        }
                      </p>
                      {isTeacher && (
                        <Link href={`/courses/${course.id}/lessons/create`}>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Lesson
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                lessons.map((lesson, index) => (
                  <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">
                              {index + 1}. {lesson.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {lesson.description}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!lesson.isPublished && (
                            <Badge variant="warning">Draft</Badge>
                          )}
                          {lesson.duration && (
                            <Badge variant="outline">
                              {lesson.duration} min
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">
                          Type: {lesson.type.toLowerCase().replace('_', ' ')}
                          {lesson.isPublished ? (
                            <span className="ml-2 text-green-600">• Published</span>
                          ) : (
                            <span className="ml-2 text-yellow-600">• Draft</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/courses/${course.id}/lessons/${lesson.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          {isTeacher && (
                            <Link href={`/courses/${course.id}/lessons/${lesson.id}/edit`}>
                              <Button size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
