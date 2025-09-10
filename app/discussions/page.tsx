'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Plus, Search, MessageCircle, Pin, Lock, User, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Discussion, DiscussionPost, UserRole } from '../types';

interface DiscussionWithDetails extends Discussion {
  postCount?: number;
  lastPost?: {
    author: string;
    createdAt: Date;
  };
  course?: {
    id: string;
    title: string;
    code: string;
  };
}

export default function DiscussionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [discussions, setDiscussions] = useState<DiscussionWithDetails[]>([]);
  const [filteredDiscussions, setFilteredDiscussions] = useState<DiscussionWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('ALL');

  // Mock data for discussions
  useEffect(() => {
    if (user) {
      const mockDiscussions: DiscussionWithDetails[] = [
        {
          id: '1',
          title: 'Algebra Help - Need help with linear equations',
          description: 'Having trouble understanding how to solve linear equations with variables on both sides. Any tips?',
          isLocked: false,
          createdAt: new Date('2024-01-08'),
          updatedAt: new Date('2024-01-10'),
          courseId: '1',
          postCount: 8,
          lastPost: {
            author: 'Alice Johnson',
            createdAt: new Date('2024-01-10T14:30:00')
          },
          course: {
            id: '1',
            title: 'Introduction to Mathematics',
            code: 'MATH101'
          }
        },
        {
          id: '2',
          title: 'General Discussion - Welcome to the course!',
          description: 'Introduce yourselves and share your learning goals for this semester.',
          isLocked: false,
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-12'),
          courseId: '1',
          postCount: 15,
          lastPost: {
            author: 'Bob Wilson',
            createdAt: new Date('2024-01-12T09:15:00')
          },
          course: {
            id: '1',
            title: 'Introduction to Mathematics',
            code: 'MATH101'
          }
        },
        {
          id: '3',
          title: 'Book Discussion - To Kill a Mockingbird Chapter Analysis',
          description: 'Let\'s discuss the themes and character development in chapters 1-5. What are your initial impressions?',
          isLocked: false,
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-13'),
          courseId: '2',
          postCount: 12,
          lastPost: {
            author: 'Emma Davis',
            createdAt: new Date('2024-01-13T16:20:00')
          },
          course: {
            id: '2',
            title: 'English Literature',
            code: 'ENG201'
          }
        },
        {
          id: '4',
          title: 'Assignment Questions - Science Lab Report Guidelines',
          description: 'Questions about the upcoming lab report assignment. Format, length, and submission guidelines.',
          isLocked: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-16'),
          courseId: '3',
          postCount: 6,
          lastPost: {
            author: 'John Smith',
            createdAt: new Date('2024-01-16T11:45:00')
          },
          course: {
            id: '3',
            title: 'Science Fundamentals',
            code: 'SCI101'
          }
        },
        {
          id: '5',
          title: 'Study Group - Forming study groups for midterm exam',
          description: 'Looking to form study groups for the upcoming midterm. Reply if interested!',
          isLocked: false,
          createdAt: new Date('2024-01-18'),
          updatedAt: new Date('2024-01-18'),
          courseId: '1',
          postCount: 3,
          lastPost: {
            author: 'Alice Johnson',
            createdAt: new Date('2024-01-18T19:30:00')
          },
          course: {
            id: '1',
            title: 'Introduction to Mathematics',
            code: 'MATH101'
          }
        }
      ];

      setDiscussions(mockDiscussions);
    }
  }, [user]);

  // Filter discussions based on search and filters
  useEffect(() => {
    let filtered = discussions;

    if (searchTerm) {
      filtered = filtered.filter(discussion =>
        discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discussion.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (courseFilter !== 'ALL') {
      filtered = filtered.filter(discussion => discussion.courseId === courseFilter);
    }

    setFilteredDiscussions(filtered);
  }, [discussions, searchTerm, courseFilter]);

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

  const getDiscussionBadges = (discussion: DiscussionWithDetails) => {
    const badges = [];
    
    if (discussion.isLocked) {
      badges.push(
        <Badge key="locked" variant="secondary">
          <Lock className="h-3 w-3 mr-1" />
          Locked
        </Badge>
      );
    }
    
    if (discussion.postCount && discussion.postCount > 10) {
      badges.push(
        <Badge key="popular" variant="success">
          Popular
        </Badge>
      );
    }

    return badges;
  };

  const getActivityIndicator = (lastPostDate: Date) => {
    const now = new Date();
    const diffHours = (now.getTime() - lastPostDate.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return <Badge variant="success">Active Today</Badge>;
    } else if (diffHours < 168) { // 7 days
      return <Badge variant="info">Active This Week</Badge>;
    } else {
      return null;
    }
  };

  const courses = Array.from(new Set(discussions.map(d => d.course).filter(Boolean)));

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
              <span className="text-sm font-medium text-gray-900">Discussions</span>
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
              <h1 className="text-2xl font-bold text-gray-900">Course Discussions</h1>
              <p className="text-gray-600 mt-1">
                Participate in course discussions, ask questions, and collaborate with classmates
              </p>
            </div>
            <Link href="/discussions/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </Link>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Discussions</p>
                    <p className="text-2xl font-bold text-gray-900">{discussions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <User className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {discussions.reduce((sum, d) => sum + (d.postCount || 0), 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Pin className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {discussions.filter(d => {
                        if (!d.lastPost) return false;
                        const diffHours = (new Date().getTime() - d.lastPost.createdAt.getTime()) / (1000 * 60 * 60);
                        return diffHours < 24;
                      }).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <Lock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Locked</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {discussions.filter(d => d.isLocked).length}
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
                      placeholder="Search discussions..."
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
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discussions List */}
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{discussion.title}</CardTitle>
                        {getDiscussionBadges(discussion)}
                      </div>
                      <CardDescription className="text-sm">
                        {discussion.description}
                      </CardDescription>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {discussion.postCount} posts
                        </span>
                        <span>in {discussion.course?.code}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {discussion.lastPost && getActivityIndicator(discussion.lastPost.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {discussion.lastPost ? (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            Last post by <strong>{discussion.lastPost.author}</strong>
                          </span>
                          <span>•</span>
                          <span>{discussion.lastPost.createdAt.toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span>No posts yet</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/discussions/${discussion.id}`}>
                        <Button variant="outline" size="sm">
                          View Discussion
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      {user.role === UserRole.TEACHER && (
                        <Link href={`/discussions/${discussion.id}/manage`}>
                          <Button size="sm">Manage</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDiscussions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchTerm || courseFilter !== 'ALL'
                  ? 'No discussions match your search criteria.'
                  : 'No discussions have been started yet.'
                }
              </div>
              {!searchTerm && courseFilter === 'ALL' && (
                <Link href="/discussions/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start the First Discussion
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
