'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  User, 
  Settings, 
  BookOpen, 
  FileText, 
  Calendar, 
  MessageSquare,
  Bell,
  BarChart3,
  FolderOpen,
  GraduationCap,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Shield,
  TrendingUp,
  Clock,
  Award,
  Users,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PieChart,
  Star
} from 'lucide-react';
import { UserRole } from '../../types';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== UserRole.TEACHER) {
      // Redirect non-teachers to their appropriate dashboard
      if (user.role === UserRole.STUDENT) {
        router.push('/dashboard/student');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || user.role !== UserRole.TEACHER) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const teacherSidebarItems = [
    { name: 'Dashboard', href: '/dashboard/teacher', icon: BarChart3, current: true },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Create Course', href: '/courses/create', icon: Plus },
    { name: 'Assignments', href: '/assignments', icon: FileText },
    { name: 'Grade Book', href: '/grades', icon: Award },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Discussions', href: '/discussions', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: FolderOpen },
    { name: 'Quizzes', href: '/quizzes', icon: GraduationCap },
    { name: 'Announcements', href: '/announcements', icon: Bell },
  ];

  if (user.role === UserRole.ADMIN) {
    teacherSidebarItems.push({ name: 'User Management', href: '/admin/users', icon: Shield });
  }

  const teachingStats = [
    { title: 'Active Courses', value: '5', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Students', value: '127', icon: Users, color: 'bg-green-100 text-green-600' },
    { title: 'Pending Grades', value: '18', icon: Award, color: 'bg-orange-100 text-orange-600' },
    { title: 'This Week Hours', value: '32', icon: Clock, color: 'bg-purple-100 text-purple-600' }
  ];

  const recentCourses = [
    { id: 1, name: 'Advanced Mathematics', students: 32, completion: 78, status: 'active' },
    { id: 2, name: 'Calculus I', students: 28, completion: 92, status: 'active' },
    { id: 3, name: 'Statistics', students: 24, completion: 65, status: 'active' },
    { id: 4, name: 'Linear Algebra', students: 19, completion: 45, status: 'draft' }
  ];

  const pendingTasks = [
    { task: 'Grade Midterm Exams - Calculus I', urgency: 'high', due: '2 days' },
    { task: 'Review Assignment Submissions', urgency: 'medium', due: '5 days' },
    { task: 'Prepare Week 8 Materials', urgency: 'low', due: '1 week' },
    { task: 'Student Progress Reviews', urgency: 'medium', due: '3 days' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-blue-600">
                EduLMS <span className="text-sm font-normal text-gray-500">Teacher Portal</span>
              </h1>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses, students, assignments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>
              </form>
            </div>

            {/* Right side - Account Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notifications Panel */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="text-lg font-semibold text-gray-900">Teaching Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Overdue assignments need grading</p>
                            <p className="text-xs text-gray-500">15 submissions pending in Calculus I</p>
                            <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New student enrolled</p>
                            <p className="text-xs text-gray-500">Sarah Johnson joined Advanced Mathematics</p>
                            <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <Link 
                        href="/announcements" 
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => setShowNotifications(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Account Dropdown Menu */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-gray-500">{user.email}</div>
                      <div className="text-xs text-blue-600 mt-1">Teacher</div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setShowAccountMenu(false);
                        handleLogout();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex pt-16">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-4 border-b lg:hidden">
            <h2 className="text-lg font-semibold">Teaching Tools</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="mt-5 px-2 space-y-1">
            {teacherSidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={`${
                      item.current ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:pl-0">
          <main className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Good Morning, Prof. {user.fullName.split(' ')[0]}! 👨‍🏫
              </h1>
              <p className="text-gray-600 mt-2">
                Ready to inspire minds today? Here's your teaching overview.
              </p>
            </div>

            {/* Teaching Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {teachingStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Management */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>My Courses</CardTitle>
                        <CardDescription>Manage your active courses and track progress</CardDescription>
                      </div>
                      <Link href="/courses/create">
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          New Course
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{course.name}</h3>
                              <p className="text-sm text-gray-500">{course.students} students enrolled</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{course.completion}% Complete</p>
                              <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${course.completion}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Link href={`/courses/${course.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Teaching Actions</CardTitle>
                    <CardDescription>Common tasks for efficient teaching</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link href="/assignments" className="flex flex-col items-center p-4 text-center bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <FileText className="h-8 w-8 text-blue-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Create Assignment</span>
                      </Link>
                      <Link href="/quizzes" className="flex flex-col items-center p-4 text-center bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <GraduationCap className="h-8 w-8 text-green-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">New Quiz</span>
                      </Link>
                      <Link href="/announcements" className="flex flex-col items-center p-4 text-center bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                        <Bell className="h-8 w-8 text-orange-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Announce</span>
                      </Link>
                      <Link href="/grades" className="flex flex-col items-center p-4 text-center bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                        <Award className="h-8 w-8 text-purple-600 mb-2" />
                        <span className="text-sm font-medium text-gray-900">Grade Book</span>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Pending Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Tasks</CardTitle>
                    <CardDescription>Items requiring your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingTasks.map((task, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            task.urgency === 'high' ? 'bg-red-500' :
                            task.urgency === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{task.task}</p>
                            <p className="text-xs text-gray-500">Due in {task.due}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Class Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Class Performance</CardTitle>
                    <CardDescription>Overall student progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Grade</span>
                        <span className="text-lg font-semibold text-green-600">84.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completion Rate</span>
                        <span className="text-lg font-semibold text-blue-600">92%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Students</span>
                        <span className="text-lg font-semibold text-purple-600">89%</span>
                      </div>
                      <Link href="/analytics">
                        <Button variant="outline" size="sm" className="w-full">
                          <PieChart className="h-4 w-4 mr-2" />
                          View Detailed Analytics
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {showAccountMenu && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowAccountMenu(false)}
        />
      )}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}
