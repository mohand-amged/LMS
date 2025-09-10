'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BookOpen, Users, FileText, Award, TrendingUp, Calendar, 
  MessageSquare, Bell, Settings, LogOut, Plus, Search,
  BarChart3, Clock, Target, Star, PieChart, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';
import { UserRole } from '../types';

// Teacher-specific interfaces
interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  activeAssignments: number;
  averageClassPerformance: number;
  pendingGrading: number;
  recentActivity: number;
}

interface StudentProgress {
  id: string;
  name: string;
  email: string;
  courses: string[];
  overallGrade: number;
  completedAssignments: number;
  totalAssignments: number;
  attendanceRate: number;
  lastActive: string;
  status: 'excellent' | 'good' | 'needs-attention' | 'at-risk';
}

interface RecentActivity {
  id: string;
  type: 'assignment_submitted' | 'quiz_completed' | 'discussion_post' | 'course_enrolled';
  studentName: string;
  courseName: string;
  description: string;
  timestamp: string;
}

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [teacherStats, setTeacherStats] = useState<TeacherStats>({
    totalCourses: 8,
    totalStudents: 156,
    activeAssignments: 12,
    averageClassPerformance: 87.5,
    pendingGrading: 23,
    recentActivity: 45
  });

  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@university.edu',
      courses: ['Advanced Mathematics', 'Calculus I'],
      overallGrade: 94.5,
      completedAssignments: 18,
      totalAssignments: 20,
      attendanceRate: 96,
      lastActive: '2 hours ago',
      status: 'excellent'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.c@university.edu',
      courses: ['Statistics', 'Linear Algebra'],
      overallGrade: 88.2,
      completedAssignments: 15,
      totalAssignments: 18,
      attendanceRate: 92,
      lastActive: '1 day ago',
      status: 'good'
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.d@university.edu',
      courses: ['Advanced Mathematics'],
      overallGrade: 76.8,
      completedAssignments: 12,
      totalAssignments: 20,
      attendanceRate: 78,
      lastActive: '3 days ago',
      status: 'needs-attention'
    }
  ]);

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'assignment_submitted',
      studentName: 'Sarah Johnson',
      courseName: 'Advanced Mathematics',
      description: 'Submitted "Calculus Problem Set #4"',
      timestamp: '10 minutes ago'
    },
    {
      id: '2',
      type: 'quiz_completed',
      studentName: 'Michael Chen',
      courseName: 'Statistics',
      description: 'Completed "Probability Distribution Quiz"',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      type: 'discussion_post',
      studentName: 'Emma Davis',
      courseName: 'Advanced Mathematics',
      description: 'Posted question in "Integration Techniques" discussion',
      timestamp: '2 hours ago'
    }
  ]);

  useEffect(() => {
    if (!user || user.role !== UserRole.TEACHER) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.TEACHER) {
    return null;
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'needs-attention':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'at-risk':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment_submitted':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'quiz_completed':
        return <Award className="h-4 w-4 text-green-600" />;
      case 'discussion_post':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case 'course_enrolled':
        return <BookOpen className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredStudents = studentProgress.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Teacher Dashboard Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                👨‍🏫 Teacher Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, Professor {user.fullName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>3 New</span>
              </Button>
              <Button
                onClick={logout}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex space-x-8 border-b">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'students', name: 'Students', icon: Users },
              { id: 'courses', name: 'My Courses', icon: BookOpen },
              { id: 'assignments', name: 'Assignments', icon: FileText },
              { id: 'analytics', name: 'Analytics', icon: TrendingUp },
              { id: 'gradebook', name: 'Gradebook', icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Courses</p>
                      <p className="text-3xl font-bold">{teacherStats.totalCourses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Students</p>
                      <p className="text-3xl font-bold">{teacherStats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Active Assignments</p>
                      <p className="text-3xl font-bold">{teacherStats.activeAssignments}</p>
                    </div>
                    <FileText className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Class Average</p>
                      <p className="text-3xl font-bold">{teacherStats.averageClassPerformance}%</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Pending Grading</p>
                      <p className="text-3xl font-bold">{teacherStats.pendingGrading}</p>
                    </div>
                    <Clock className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Recent Activity</p>
                      <p className="text-3xl font-bold">{teacherStats.recentActivity}</p>
                    </div>
                    <Activity className="h-8 w-8 text-indigo-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common teaching tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col space-y-2">
                    <Plus className="h-6 w-6" />
                    <span>Create Course</span>
                  </Button>
                  <Button className="h-20 flex flex-col space-y-2" variant="outline">
                    <FileText className="h-6 w-6" />
                    <span>New Assignment</span>
                  </Button>
                  <Button className="h-20 flex flex-col space-y-2" variant="outline">
                    <Award className="h-6 w-6" />
                    <span>Grade Submissions</span>
                  </Button>
                  <Button className="h-20 flex flex-col space-y-2" variant="outline">
                    <MessageSquare className="h-6 w-6" />
                    <span>Send Announcement</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Student Activity</CardTitle>
                  <CardDescription>Latest submissions and interactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                        <div className="p-2 rounded-full bg-white">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.studentName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.courseName} • {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Class Performance Overview</CardTitle>
                  <CardDescription>Quick glance at student progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Excellent (90%+)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">45%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Good (80-89%)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">35%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Needs Attention (70-79%)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">15%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">At Risk (<70%)</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>

            {/* Students List */}
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-lg">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-gray-600">{student.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className={getStatusBadgeColor(student.status)}>
                              {student.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Last active: {student.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {student.overallGrade.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {student.completedAssignments}/{student.totalAssignments} assignments
                        </div>
                        <div className="text-sm text-gray-600">
                          {student.attendanceRate}% attendance
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{Math.round((student.completedAssignments / student.totalAssignments) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all" 
                          style={{ width: `${(student.completedAssignments / student.totalAssignments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Enrolled in: </span>
                        {student.courses.slice(0, 2).map((course, idx) => (
                          <Badge key={idx} variant="outline" className="ml-1">
                            {course}
                          </Badge>
                        ))}
                        {student.courses.length > 2 && (
                          <Badge variant="outline" className="ml-1">
                            +{student.courses.length - 2} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Profile</Button>
                        <Button size="sm" variant="outline">Send Message</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            userRole="TEACHER" 
            userId={user.id} 
            type="overview"
          />
        )}

        {/* Other tabs content can be added similarly */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Course cards would go here */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Course management interface coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
