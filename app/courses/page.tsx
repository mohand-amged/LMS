'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Plus, Search, Filter, Users, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { Course, CourseStatus, UserRole } from '../types';

export default function CoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CourseStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Mock data for courses
  useEffect(() => {
    if (user) {
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Introduction to Mathematics',
          description: 'Basic mathematical concepts and operations for beginners.',
          code: 'MATH101',
          imageUrl: '/api/placeholder/300/200',
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
          description: 'Exploring classic and contemporary literature.',
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
        },
        {
          id: '3',
          title: 'Science Fundamentals',
          description: 'Basic principles of physics, chemistry, and biology.',
          code: 'SCI101',
          category: 'Science',
          status: CourseStatus.DRAFT,
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-02-10'),
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

      // Filter courses based on user role
      if (user.role === UserRole.TEACHER) {
        setCourses(mockCourses.filter(course => course.teacherId === user.id));
      } else {
        setCourses(mockCourses.filter(course => course.status === CourseStatus.PUBLISHED));
      }
    }
  }, [user]);

  // Filter courses based on search and filters
  useEffect(() => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(course => course.category === categoryFilter);
    }

    setFilteredCourses(filtered);
  }, [courses, searchTerm, statusFilter, categoryFilter]);

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

  const categories = Array.from(new Set(courses.map(course => course.category).filter(Boolean)));

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
              <span className="text-sm font-medium text-gray-900">Courses</span>
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
                {user.role === UserRole.TEACHER ? 'My Courses' : 'Available Courses'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === UserRole.TEACHER 
                  ? 'Manage your courses and track student progress'
                  : 'Discover and enroll in courses'
                }
              </p>
            </div>
            {user.role === UserRole.TEACHER && (
              <Link href="/courses/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </Link>
            )}
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as CourseStatus | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Status</option>
                    <option value={CourseStatus.PUBLISHED}>Published</option>
                    <option value={CourseStatus.DRAFT}>Draft</option>
                    <option value={CourseStatus.ARCHIVED}>Archived</option>
                  </select>
                  
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {course.code} • {course.category}
                      </CardDescription>
                    </div>
                    {getStatusBadge(course.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Instructor: {course.teacher?.fullName}</span>
                    </div>
                    {course.startDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Starts: {course.startDate.toLocaleDateString()}</span>
                      </div>
                    )}
                    {course.endDate && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Ends: {course.endDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Link href={`/courses/${course.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Course
                      </Button>
                    </Link>
                    {user.role === UserRole.TEACHER ? (
                      <Link href={`/courses/${course.id}/edit`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                    ) : course.status === CourseStatus.PUBLISHED && (
                      <Button size="sm">Enroll</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'No courses match your search criteria.'
                  : user.role === UserRole.TEACHER
                    ? 'You haven\'t created any courses yet.'
                    : 'No courses available at the moment.'
                }
              </div>
              {user.role === UserRole.TEACHER && !searchTerm && statusFilter === 'ALL' && categoryFilter === 'ALL' && (
                <Link href="/courses/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
