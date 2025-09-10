'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { ArrowLeft, Play, Book, Clock, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Lesson, Course, UserRole, LessonType, LessonContent } from '../../../../types';

export default function LessonViewPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [lessonContent, setLessonContent] = useState<LessonContent[]>([]);

  // Mock data
  useEffect(() => {
    if (user && courseId && lessonId) {
      // Mock course data
      const mockCourse: Course = {
        id: courseId,
        title: 'Introduction to Mathematics',
        description: 'Basic mathematical concepts and operations for beginners.',
        code: 'MATH101',
        category: 'Mathematics',
        status: 'PUBLISHED' as any,
        createdAt: new Date(),
        updatedAt: new Date(),
        teacherId: 'demo-teacher-1',
        teacher: {
          id: 'demo-teacher-1',
          fullName: 'John Smith',
          username: 'jsmith',
          email: 'teacher@example.com',
          role: UserRole.TEACHER,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const mockLessons: Lesson[] = [
        {
          id: '1',
          title: 'Introduction to Basic Algebra',
          description: 'Learn the fundamentals of algebraic expressions and equations.',
          content: JSON.stringify([
            { 
              type: 'text', 
              data: 'Welcome to our first lesson on algebra! In this comprehensive introduction, we will explore the basic concepts of algebraic expressions and learn how they form the foundation of mathematical problem-solving.' 
            },
            { 
              type: 'text', 
              data: 'An algebraic expression is a mathematical phrase that contains variables (like x or y), numbers, and operations (such as +, -, ×, ÷). Unlike arithmetic expressions that only use numbers, algebraic expressions use letters to represent unknown values.' 
            },
            { 
              type: 'text', 
              data: 'For example: 2x + 5 is an algebraic expression where:\n• 2 is the coefficient\n• x is the variable\n• 5 is the constant term\n• + is the operation' 
            },
            { 
              type: 'text', 
              data: 'Understanding these components is crucial as we progress to more complex algebraic concepts in future lessons.' 
            }
          ]),
          type: LessonType.TEXT,
          order: 1,
          duration: 30,
          isPublished: true,
          createdAt: new Date('2024-01-02'),
          updatedAt: new Date('2024-01-02'),
          courseId: courseId
        },
        {
          id: '2',
          title: 'Solving Linear Equations',
          description: 'Step-by-step guide to solving linear equations with one variable.',
          content: JSON.stringify([
            { 
              type: 'text', 
              data: 'Linear equations are equations where the highest power of the variable is 1. They form straight lines when graphed, which is why they\'re called "linear".' 
            },
            { 
              type: 'text', 
              data: 'To solve a linear equation, we need to isolate the variable on one side of the equation. We do this by performing the same operation on both sides of the equation.' 
            }
          ]),
          type: LessonType.VIDEO,
          order: 2,
          duration: 45,
          videoUrl: 'https://www.example.com/video1',
          isPublished: true,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-05'),
          courseId: courseId
        },
        {
          id: '3',
          title: 'Graphing Linear Functions',
          description: 'Understanding how to plot and interpret linear functions on a coordinate plane.',
          content: JSON.stringify([
            { 
              type: 'text', 
              data: 'A linear function creates a straight line when graphed on a coordinate plane. Understanding how to graph these functions is essential for visualizing mathematical relationships.' 
            }
          ]),
          type: LessonType.PRESENTATION,
          order: 3,
          duration: 40,
          isPublished: false,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          courseId: courseId
        }
      ];

      setCourse(mockCourse);
      setAllLessons(mockLessons);
      
      const foundLesson = mockLessons.find(l => l.id === lessonId);
      if (foundLesson) {
        setLesson(foundLesson);
        try {
          const content = JSON.parse(foundLesson.content) as LessonContent[];
          setLessonContent(content);
        } catch (error) {
          console.error('Error parsing lesson content:', error);
          setLessonContent([]);
        }
      }
    }
  }, [user, courseId, lessonId]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO:
        return <Play className="h-5 w-5 text-red-600" />;
      case LessonType.TEXT:
        return <Book className="h-5 w-5 text-blue-600" />;
      case LessonType.PRESENTATION:
        return <FileText className="h-5 w-5 text-purple-600" />;
      default:
        return <Book className="h-5 w-5 text-gray-600" />;
    }
  };

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {content.data}
            </p>
          </div>
        );
      case 'video':
        return (
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Video: {content.data}</p>
              {content.caption && (
                <p className="text-sm text-gray-500 mt-1">{content.caption}</p>
              )}
            </div>
          </div>
        );
      case 'image':
        return (
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Image: {content.data}</p>
            </div>
            {content.caption && (
              <p className="text-sm text-gray-500 mt-2">{content.caption}</p>
            )}
          </div>
        );
      default:
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">{content.data}</p>
          </div>
        );
    }
  };

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.id === lessonId);
  };

  const getNavigationLessons = () => {
    const currentIndex = getCurrentLessonIndex();
    const publishedLessons = allLessons.filter(l => l.isPublished || user?.role === UserRole.TEACHER);
    const currentIndexInPublished = publishedLessons.findIndex(l => l.id === lessonId);
    
    return {
      previous: currentIndexInPublished > 0 ? publishedLessons[currentIndexInPublished - 1] : null,
      next: currentIndexInPublished < publishedLessons.length - 1 ? publishedLessons[currentIndexInPublished + 1] : null
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !lesson || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link href={`/courses/${courseId}`} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Course
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
            <p className="text-gray-600 mb-6">The lesson you're looking for doesn't exist or has been removed.</p>
            <Link href={`/courses/${courseId}`}>
              <Button>Back to Course</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navigation = getNavigationLessons();
  const isTeacher = user.role === UserRole.TEACHER && course.teacherId === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href={`/courses/${courseId}`} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {course.title}
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">{lesson.title}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.fullName}
              </span>
              {isTeacher && (
                <Link href={`/courses/${courseId}/lessons/${lessonId}/edit`}>
                  <Button variant="outline" size="sm">
                    Edit Lesson
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Lesson Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getLessonIcon(lesson.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-2xl">{lesson.title}</CardTitle>
                    {!lesson.isPublished && (
                      <Badge variant="warning">Draft</Badge>
                    )}
                  </div>
                  <CardDescription className="text-base mb-4">
                    {lesson.description}
                  </CardDescription>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{lesson.duration} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <Book className="h-4 w-4 mr-2" />
                      <span>Lesson {lesson.order}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>{lesson.type.toLowerCase().replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Lesson Content */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-6">
                {lesson.type === LessonType.VIDEO && lesson.videoUrl && (
                  <div className="mb-6">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">Video Lesson</p>
                        <p className="text-gray-600">Video content would be embedded here</p>
                        <Button className="mt-4" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Play Video
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {lessonContent.map((content, index) => (
                  <div key={index} className="lesson-content-block">
                    {renderContent(content)}
                  </div>
                ))}

                {lessonContent.length === 0 && (
                  <div className="text-center py-12">
                    <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
                    <p className="text-gray-600">
                      {isTeacher 
                        ? 'This lesson doesn\'t have any content yet. Click "Edit Lesson" to add content.'
                        : 'The lesson content is not available at this time.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <div>
              {navigation.previous && (
                <Link href={`/courses/${courseId}/lessons/${navigation.previous.id}`}>
                  <Button variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous: {navigation.previous.title}
                  </Button>
                </Link>
              )}
            </div>
            <div>
              {navigation.next && (
                <Link href={`/courses/${courseId}/lessons/${navigation.next.id}`}>
                  <Button>
                    Next: {navigation.next.title}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
