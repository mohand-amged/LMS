'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Plus, Search, Calendar, Clock, FileText, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Assignment, AssignmentType, UserRole } from '../types';

export default function AssignmentsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<AssignmentType | 'ALL'>('ALL');

  // Mock data for assignments
  useEffect(() => {
    if (user) {
      const now = new Date();
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Math Problem Set 1',
          description: 'Complete exercises 1-10 from Chapter 2 on basic algebra.',
          type: AssignmentType.ESSAY,
          maxPoints: 50,
          dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          isPublished: true,
          createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          courseId: '1',
          teacherId: user.role === UserRole.TEACHER ? user.id : 'demo-teacher-1'
        },
        {
          id: '2',
          title: 'Essay: Climate Change',
          description: 'Write a 500-word essay on the impacts of climate change on marine ecosystems.',
          type: AssignmentType.ESSAY,
          maxPoints: 100,
          dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          isPublished: true,
          createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
          courseId: '3',
          teacherId: user.role === UserRole.TEACHER ? user.id : 'demo-teacher-1'
        },
        {
          id: '3',
          title: 'Literature Analysis Quiz',
          description: 'Multiple choice quiz covering Chapters 1-3 of "To Kill a Mockingbird".',
          type: AssignmentType.MULTIPLE_CHOICE,
          maxPoints: 75,
          dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
          isPublished: true,
          createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
          courseId: '2',
          teacherId: user.role === UserRole.TEACHER ? user.id : 'demo-teacher-1'
        },
        {
          id: '4',
          title: 'Science Lab Report',
          description: 'Complete lab report on photosynthesis experiment conducted last week.',
          type: AssignmentType.PROJECT,
          maxPoints: 80,
          dueDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          isPublished: false,
          createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
          courseId: '3',
          teacherId: user.role === UserRole.TEACHER ? user.id : 'demo-teacher-1'
        }
      ];

      // Filter assignments based on user role
      if (user.role === UserRole.TEACHER) {
        setAssignments(mockAssignments.filter(assignment => assignment.teacherId === user.id));
      } else {
        setAssignments(mockAssignments.filter(assignment => assignment.isPublished));
      }
    }
  }, [user]);

  // Filter assignments based on search and filters
  useEffect(() => {
    let filtered = assignments;
    const now = new Date();

    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => {
        const dueDate = new Date(assignment.dueDate);
        switch (statusFilter) {
          case 'upcoming':
            return dueDate > now;
          case 'overdue':
            return dueDate < now && user?.role === UserRole.STUDENT;
          case 'completed':
            // This would check if student has submitted - for now just return empty
            return false;
          default:
            return true;
        }
      });
    }

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(assignment => assignment.type === typeFilter);
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, typeFilter, user]);

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

  const getStatusBadge = (assignment: Assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < now;
    
    if (!assignment.isPublished && user.role === UserRole.TEACHER) {
      return <Badge variant="warning">Draft</Badge>;
    }
    if (isOverdue) {
      return <Badge variant="destructive">Overdue</Badge>;
    }
    
    // Check if due soon (within 2 days)
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    if (dueDate <= twoDaysFromNow) {
      return <Badge variant="warning">Due Soon</Badge>;
    }
    
    return <Badge variant="success">Active</Badge>;
  };

  const getTypeIcon = (type: AssignmentType) => {
    switch (type) {
      case AssignmentType.ESSAY:
        return <FileText className="h-4 w-4" />;
      case AssignmentType.MULTIPLE_CHOICE:
        return <Users className="h-4 w-4" />;
      case AssignmentType.PROJECT:
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
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
              <span className="text-sm font-medium text-gray-900">Assignments</span>
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
                {user.role === UserRole.TEACHER ? 'My Assignments' : 'Assignments'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === UserRole.TEACHER 
                  ? 'Create and manage assignments for your courses'
                  : 'View and complete your assignments'
                }
              </p>
            </div>
            {user.role === UserRole.TEACHER && (
              <Link href="/assignments/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
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
                      placeholder="Search assignments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="overdue">Overdue</option>
                    <option value="completed">Completed</option>
                  </select>
                  
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as AssignmentType | 'ALL')}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Types</option>
                    <option value={AssignmentType.ESSAY}>Essay</option>
                    <option value={AssignmentType.MULTIPLE_CHOICE}>Multiple Choice</option>
                    <option value={AssignmentType.PROJECT}>Project</option>
                    <option value={AssignmentType.PRESENTATION}>Presentation</option>
                    <option value={AssignmentType.LAB}>Lab</option>
                    <option value={AssignmentType.OTHER}>Other</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(assignment.type)}
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      </div>
                      <CardDescription>
                        {assignment.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(assignment)}
                      <Badge variant="outline">{assignment.maxPoints} pts</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Time: {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      <span>Type: {assignment.type.replace('_', ' ').toLowerCase()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(assignment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/assignments/${assignment.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                      {user.role === UserRole.TEACHER ? (
                        <Link href={`/assignments/${assignment.id}/edit`}>
                          <Button size="sm">Edit</Button>
                        </Link>
                      ) : assignment.isPublished && (
                        <Link href={`/assignments/${assignment.id}/submit`}>
                          <Button size="sm">Submit</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'ALL'
                  ? 'No assignments match your search criteria.'
                  : user.role === UserRole.TEACHER
                    ? 'You haven\'t created any assignments yet.'
                    : 'No assignments available at the moment.'
                }
              </div>
              {user.role === UserRole.TEACHER && !searchTerm && statusFilter === 'all' && typeFilter === 'ALL' && (
                <Link href="/assignments/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Assignment
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
