'use client';

import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  Award
} from 'lucide-react';
import { UserRole } from '../types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, current: true },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Assignments', href: '/assignments', icon: FileText },
    { name: 'Grades', href: '/grades', icon: Award },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Discussions', href: '/discussions', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: FolderOpen },
    { name: 'Quizzes', href: '/quizzes', icon: GraduationCap },
    { name: 'Announcements', href: '/announcements', icon: Bell },
    { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  ];

  if (user.role === UserRole.ADMIN) {
    sidebarItems.push({ name: 'User Management', href: '/admin/users', icon: Shield });
  }

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
              <h1 className="text-xl font-bold text-gray-900">
                EduLMS
              </h1>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses, assignments, discussions..."
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
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New assignment posted</p>
                            <p className="text-xs text-gray-500">Calculus Problem Set due Friday</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Award className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Grade available</p>
                            <p className="text-xs text-gray-500">Your quiz score: 87%</p>
                            <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Discussion reply</p>
                            <p className="text-xs text-gray-500">Prof. Smith replied to your question</p>
                            <p className="text-xs text-gray-400 mt-1">1 day ago</p>
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
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="mt-5 px-2 space-y-1">
            {sidebarItems.map((item) => {
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
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user.fullName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your learning today.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {user.role === UserRole.TEACHER ? 'Teaching' : 'Enrolled'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {user.role === UserRole.TEACHER ? 'Created' : 'Pending'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {user.role === UserRole.TEACHER ? 'Avg Score' : 'Your Grade'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">87%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-2xl font-bold text-gray-900">24h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest learning activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.role === UserRole.TEACHER ? 'Created new lesson' : 'Completed lesson'} in Advanced Mathematics
                          </p>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.role === UserRole.TEACHER ? 'Graded assignment' : 'Submitted assignment'}: "Calculus Problem Set"
                          </p>
                          <p className="text-sm text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.role === UserRole.TEACHER ? 'Replied to discussion' : 'Posted in discussion'} "Help with Homework"
                          </p>
                          <p className="text-sm text-gray-500">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {user.role === UserRole.TEACHER ? (
                        <>
                          <Link href="/courses/create" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                            Create Course
                          </Link>
                          <Link href="/assignments" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <FileText className="w-5 h-5 mr-3 text-green-500" />
                            Create Assignment
                          </Link>
                          <Link href="/quizzes" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <GraduationCap className="w-5 h-5 mr-3 text-purple-500" />
                            Create Quiz
                          </Link>
                          <Link href="/announcements" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <Bell className="w-5 h-5 mr-3 text-orange-500" />
                            Post Announcement
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/courses" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <BookOpen className="w-5 h-5 mr-3 text-blue-500" />
                            Browse Courses
                          </Link>
                          <Link href="/assignments" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <FileText className="w-5 h-5 mr-3 text-green-500" />
                            View Assignments
                          </Link>
                          <Link href="/grades" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <Award className="w-5 h-5 mr-3 text-purple-500" />
                            Check Grades
                          </Link>
                          <Link href="/discussions" className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50">
                            <MessageSquare className="w-5 h-5 mr-3 text-orange-500" />
                            Join Discussion
                          </Link>
                        </>
                      )}
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
