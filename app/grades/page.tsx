'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Search, TrendingUp, TrendingDown, BarChart3, BookOpen, Award } from 'lucide-react';
import Link from 'next/link';
import { Grade, Assignment, UserRole, Course } from '../types';

interface GradeWithDetails extends Grade {
  assignment?: Assignment;
  course?: Course;
}

export default function GradesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [grades, setGrades] = useState<GradeWithDetails[]>([]);
  const [filteredGrades, setFilteredGrades] = useState<GradeWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');

  // Mock data for grades
  useEffect(() => {
    if (user) {
      const mockGrades: GradeWithDetails[] = [
        {
          id: '1',
          score: 45,
          maxScore: 50,
          percentage: 90,
          feedback: 'Excellent work! Your understanding of algebraic concepts is clear.',
          gradedAt: new Date('2024-01-10'),
          studentId: user.role === UserRole.STUDENT ? user.id : 'demo-student-1',
          assignment: {
            id: '1',
            title: 'Math Problem Set 1',
            description: 'Basic algebra problems',
            type: 'ESSAY' as any,
            maxPoints: 50,
            dueDate: new Date('2024-01-08'),
            isPublished: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            courseId: '1',
            teacherId: 'demo-teacher-1'
          },
          course: {
            id: '1',
            title: 'Introduction to Mathematics',
            description: 'Basic math concepts',
            code: 'MATH101',
            status: 'PUBLISHED' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            teacherId: 'demo-teacher-1'
          }
        },
        {
          id: '2',
          score: 78,
          maxScore: 100,
          percentage: 78,
          feedback: 'Good analysis of climate change impacts. Could improve on citing sources.',
          gradedAt: new Date('2024-01-15'),
          studentId: user.role === UserRole.STUDENT ? user.id : 'demo-student-1',
          assignment: {
            id: '2',
            title: 'Essay: Climate Change',
            description: 'Climate change essay',
            type: 'ESSAY' as any,
            maxPoints: 100,
            dueDate: new Date('2024-01-12'),
            isPublished: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            courseId: '3',
            teacherId: 'demo-teacher-1'
          },
          course: {
            id: '3',
            title: 'Science Fundamentals',
            description: 'Basic science concepts',
            code: 'SCI101',
            status: 'PUBLISHED' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            teacherId: 'demo-teacher-1'
          }
        },
        {
          id: '3',
          score: 58,
          maxScore: 75,
          percentage: 77.3,
          feedback: 'Shows understanding of the literature. Some questions could be answered more thoroughly.',
          gradedAt: new Date('2024-01-20'),
          studentId: user.role === UserRole.STUDENT ? user.id : 'demo-student-2',
          assignment: {
            id: '3',
            title: 'Literature Analysis Quiz',
            description: 'Quiz on literature',
            type: 'MULTIPLE_CHOICE' as any,
            maxPoints: 75,
            dueDate: new Date('2024-01-18'),
            isPublished: true,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            courseId: '2',
            teacherId: 'demo-teacher-1'
          },
          course: {
            id: '2',
            title: 'English Literature',
            description: 'Literature studies',
            code: 'ENG201',
            status: 'PUBLISHED' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            teacherId: 'demo-teacher-1'
          }
        }
      ];

      // Filter grades based on user role
      if (user.role === UserRole.STUDENT) {
        setGrades(mockGrades.filter(grade => grade.studentId === user.id));
      } else {
        // For teachers, show all grades for their courses
        setGrades(mockGrades);
      }
    }
  }, [user]);

  // Filter grades based on search and filters
  useEffect(() => {
    let filtered = grades;

    if (searchTerm) {
      filtered = filtered.filter(grade =>
        grade.assignment?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.course?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (courseFilter !== 'ALL') {
      filtered = filtered.filter(grade => grade.course?.id === courseFilter);
    }

    setFilteredGrades(filtered);
  }, [grades, searchTerm, courseFilter]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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

  // Calculate statistics
  const totalGrades = filteredGrades.length;
  const averagePercentage = totalGrades > 0 
    ? filteredGrades.reduce((sum, grade) => sum + grade.percentage, 0) / totalGrades
    : 0;
  
  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge variant="success">A</Badge>;
    if (percentage >= 80) return <Badge variant="info">B</Badge>;
    if (percentage >= 70) return <Badge variant="warning">C</Badge>;
    if (percentage >= 60) return <Badge variant="outline">D</Badge>;
    return <Badge variant="destructive">F</Badge>;
  };

  const courses = Array.from(new Set(grades.map(grade => grade.course).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Grades</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.fullName}
              </span>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.role === UserRole.TEACHER ? 'Grade Management' : 'My Grades'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === UserRole.TEACHER 
                  ? 'View and manage student grades across all courses'
                  : 'Track your academic progress and performance'
                }
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">{totalGrades}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                    <p className="text-2xl font-bold text-gray-900">{averagePercentage.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Letter Grade</p>
                    <p className="text-2xl font-bold text-gray-900">{getLetterGrade(averagePercentage)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  {averagePercentage >= 75 ? (
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  ) : (
                    <TrendingDown className="h-8 w-8 text-red-600" />
                  )}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Performance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {averagePercentage >= 85 ? 'Excellent' :
                       averagePercentage >= 75 ? 'Good' :
                       averagePercentage >= 65 ? 'Fair' : 'Needs Work'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search assignments or courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Courses</option>
                    {courses.map(course => course && (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grades List */}
          <div className="space-y-4">
            {filteredGrades.map((grade) => (
              <Card key={grade.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{grade.assignment?.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <span>{grade.course?.title}</span>
                        <span>•</span>
                        <span>{grade.course?.code}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getGradeBadge(grade.percentage)}
                      <Badge variant="outline">
                        {grade.score}/{grade.maxScore}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Score:</span>
                      <span className="text-lg font-bold text-gray-900">
                        {grade.percentage.toFixed(1)}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          grade.percentage >= 90 ? 'bg-green-500' :
                          grade.percentage >= 80 ? 'bg-blue-500' :
                          grade.percentage >= 70 ? 'bg-yellow-500' :
                          grade.percentage >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${grade.percentage}%` }}
                      />
                    </div>

                    {grade.feedback && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Feedback:</h4>
                        <p className="text-sm text-gray-600">{grade.feedback}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
                      <span>Graded: {grade.gradedAt.toLocaleDateString()}</span>
                      <span>Points: {grade.score} / {grade.maxScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredGrades.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchTerm || courseFilter !== 'ALL'
                  ? 'No grades match your search criteria.'
                  : user.role === UserRole.TEACHER
                    ? 'No grades to display. Students haven\'t submitted assignments yet.'
                    : 'You don\'t have any graded assignments yet.'
                }
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
