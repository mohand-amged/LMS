'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Users, BookOpen, Award, Clock, Target, Download } from 'lucide-react';
import Link from 'next/link';
import { UserRole } from '../types';

interface AnalyticsData {
  overview: {
    totalCourses: number;
    totalStudents: number;
    totalAssignments: number;
    averageGrade: number;
    completionRate: number;
    engagementScore: number;
  };
  coursePerformance: {
    courseId: string;
    courseName: string;
    enrolled: number;
    completed: number;
    averageGrade: number;
    completionRate: number;
  }[];
  gradeDistribution: {
    grade: string;
    count: number;
    percentage: number;
  }[];
  timeMetrics: {
    period: string;
    assignments: number;
    submissions: number;
    grades: number;
  }[];
  studentProgress: {
    studentId: string;
    studentName: string;
    coursesEnrolled: number;
    assignmentsCompleted: number;
    averageGrade: number;
    lastActivity: Date;
  }[];
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Mock analytics data
  useEffect(() => {
    if (user) {
      const mockAnalytics: AnalyticsData = {
        overview: {
          totalCourses: user.role === UserRole.TEACHER ? 3 : 4,
          totalStudents: user.role === UserRole.TEACHER ? 42 : 1,
          totalAssignments: 15,
          averageGrade: 84.2,
          completionRate: 78.5,
          engagementScore: 85.3
        },
        coursePerformance: user.role === UserRole.TEACHER ? [
          {
            courseId: '1',
            courseName: 'Introduction to Mathematics',
            enrolled: 18,
            completed: 14,
            averageGrade: 86.4,
            completionRate: 77.8
          },
          {
            courseId: '2',
            courseName: 'English Literature',
            enrolled: 15,
            completed: 12,
            averageGrade: 82.1,
            completionRate: 80.0
          },
          {
            courseId: '3',
            courseName: 'Science Fundamentals',
            enrolled: 9,
            completed: 7,
            averageGrade: 88.3,
            completionRate: 77.8
          }
        ] : [
          {
            courseId: '1',
            courseName: 'Introduction to Mathematics',
            enrolled: 1,
            completed: 0,
            averageGrade: 85.0,
            completionRate: 60.0
          },
          {
            courseId: '2',
            courseName: 'English Literature',
            enrolled: 1,
            completed: 0,
            averageGrade: 78.0,
            completionRate: 55.0
          },
          {
            courseId: '3',
            courseName: 'Science Fundamentals',
            enrolled: 1,
            completed: 0,
            averageGrade: 92.0,
            completionRate: 80.0
          }
        ],
        gradeDistribution: [
          { grade: 'A (90-100)', count: 12, percentage: 28.6 },
          { grade: 'B (80-89)', count: 18, percentage: 42.9 },
          { grade: 'C (70-79)', count: 8, percentage: 19.0 },
          { grade: 'D (60-69)', count: 3, percentage: 7.1 },
          { grade: 'F (0-59)', count: 1, percentage: 2.4 }
        ],
        timeMetrics: [
          { period: 'Week 1', assignments: 3, submissions: 42, grades: 38 },
          { period: 'Week 2', assignments: 2, submissions: 36, grades: 36 },
          { period: 'Week 3', assignments: 4, submissions: 58, grades: 52 },
          { period: 'Week 4', assignments: 1, submissions: 15, grades: 15 }
        ],
        studentProgress: user.role === UserRole.TEACHER ? [
          {
            studentId: '1',
            studentName: 'Alice Johnson',
            coursesEnrolled: 3,
            assignmentsCompleted: 12,
            averageGrade: 92.5,
            lastActivity: new Date('2024-01-20')
          },
          {
            studentId: '2',
            studentName: 'Bob Wilson',
            coursesEnrolled: 2,
            assignmentsCompleted: 8,
            averageGrade: 78.3,
            lastActivity: new Date('2024-01-19')
          },
          {
            studentId: '3',
            studentName: 'Emma Davis',
            coursesEnrolled: 3,
            assignmentsCompleted: 10,
            averageGrade: 85.7,
            lastActivity: new Date('2024-01-21')
          }
        ] : []
      };

      setAnalytics(mockAnalytics);
    }
  }, [user, timeRange]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !analytics) {
    return null;
  }

  const getPerformanceIndicator = (value: number, threshold: number = 75) => {
    if (value >= threshold + 10) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (value >= threshold) {
      return <Target className="h-4 w-4 text-blue-600" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

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
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="semester">This Semester</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === UserRole.TEACHER ? 'Teaching Analytics' : 'Learning Analytics'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user.role === UserRole.TEACHER 
                ? 'Monitor student progress and course performance'
                : 'Track your academic progress and performance'
              }
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {user.role === UserRole.TEACHER ? 'Total Courses' : 'Enrolled Courses'}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalCourses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {user.role === UserRole.TEACHER && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-3xl font-bold text-gray-900">{analytics.overview.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Grade</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-gray-900">{analytics.overview.averageGrade}%</p>
                      {getPerformanceIndicator(analytics.overview.averageGrade, 80)}
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-gray-900">{analytics.overview.completionRate}%</p>
                      {getPerformanceIndicator(analytics.overview.completionRate)}
                    </div>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Course Performance
                </CardTitle>
                <CardDescription>
                  {user.role === UserRole.TEACHER ? 'Performance across all your courses' : 'Your performance in each course'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.coursePerformance.map((course) => (
                    <div key={course.courseId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{course.courseName}</h4>
                        <Badge variant="outline">{course.averageGrade.toFixed(1)}%</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="block">
                            {user.role === UserRole.TEACHER ? 'Enrolled:' : 'Progress:'} {course.enrolled}
                          </span>
                        </div>
                        <div>
                          <span className="block">Completion: {course.completionRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>
                  {user.role === UserRole.TEACHER ? 'Distribution of student grades' : 'Your grade distribution'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.gradeDistribution.map((item) => (
                    <div key={item.grade} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getGradeColor(item.grade)}>
                          {item.grade.split(' ')[0]}
                        </Badge>
                        <span className="text-sm text-gray-600">{item.grade}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.count}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Over Time
              </CardTitle>
              <CardDescription>
                {user.role === UserRole.TEACHER ? 'Teaching activity metrics' : 'Your learning activity'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {analytics.timeMetrics.map((metric) => (
                  <div key={metric.period} className="border rounded-lg p-4 text-center">
                    <h4 className="font-medium text-sm text-gray-600 mb-2">{metric.period}</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{metric.assignments}</p>
                        <p className="text-xs text-gray-500">Assignments</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-green-600">{metric.submissions}</p>
                        <p className="text-xs text-gray-500">Submissions</p>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-purple-600">{metric.grades}</p>
                        <p className="text-xs text-gray-500">Grades</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Progress (Teacher only) */}
          {user.role === UserRole.TEACHER && analytics.studentProgress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Student Progress</CardTitle>
                <CardDescription>Individual student performance overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Student</th>
                        <th className="text-left py-2">Courses</th>
                        <th className="text-left py-2">Completed</th>
                        <th className="text-left py-2">Average Grade</th>
                        <th className="text-left py-2">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.studentProgress.map((student) => (
                        <tr key={student.studentId} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium">{student.studentName}</td>
                          <td className="py-3">{student.coursesEnrolled}</td>
                          <td className="py-3">{student.assignmentsCompleted}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span>{student.averageGrade.toFixed(1)}%</span>
                              {getPerformanceIndicator(student.averageGrade, 80)}
                            </div>
                          </td>
                          <td className="py-3 text-gray-600">
                            {student.lastActivity.toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
