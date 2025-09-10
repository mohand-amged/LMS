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
  TrendingUp,
  Clock,
  Award,
  Play,
  CheckCircle,
  AlertTriangle,
  Target,
  Zap,
  BookmarkIcon,
  Star,
  Progress
} from 'lucide-react';
import { UserRole } from '../../types';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && user.role !== UserRole.STUDENT) {
      // Redirect non-students to their appropriate dashboard
      if (user.role === UserRole.TEACHER) {
        router.push('/dashboard/teacher');
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

  if (!user || user.role !== UserRole.STUDENT) {
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

  const studentSidebarItems = [
    { name: 'Dashboard', href: '/dashboard/student', icon: BarChart3, current: true },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Assignments', href: '/assignments', icon: FileText },
    { name: 'Grades', href: '/grades', icon: Award },
    { name: 'Schedule', href: '/calendar', icon: Calendar },
    { name: 'Discussions', href: '/discussions', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: FolderOpen },
    { name: 'Quizzes', href: '/quizzes', icon: GraduationCap },
    { name: 'Announcements', href: '/announcements', icon: Bell },
    { name: 'Progress', href: '/analytics', icon: TrendingUp },
  ];

  const learningStats = [
    { title: 'Enrolled Courses', value: '6', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { title: 'Completed Tasks', value: '24', icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Current Grade', value: '87%', icon: Star, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Study Hours', value: '42h', icon: Clock, color: 'bg-purple-100 text-purple-600' }
  ];

  const enrolledCourses = [
    { 
      id: 1, 
      name: 'Advanced Mathematics', 
      instructor: 'Prof. John Smith', 
      progress: 78, 
      grade: 'A-', 
      nextLesson: 'Calculus Integration',
      dueAssignment: 'Problem Set 4 - Due Tomorrow'
    },
    { 
      id: 2, 
      name: 'Physics I', 
      instructor: 'Dr. Sarah Johnson', 
      progress: 65, 
      grade: 'B+', 
      nextLesson: 'Newton\'s Laws',
      dueAssignment: 'Lab Report - Due Friday'
    },
    { 
      id: 3, 
      name: 'English Literature', 
      instructor: 'Ms. Emily Davis', 
      progress: 92, 
      grade: 'A', 
      nextLesson: 'Shakespeare Analysis',
      dueAssignment: null
    },
    { 
      id: 4, 
      name: 'Computer Science', 
      instructor: 'Dr. Michael Brown', 
      progress: 45, 
      grade: 'B', 
      nextLesson: 'Data Structures',
      dueAssignment: 'Coding Assignment - Due Monday'
    }
  ];

  const upcomingTasks = [
    { task: 'Math Problem Set 4', course: 'Advanced Mathematics', due: 'Tomorrow', priority: 'high' },
    { task: 'Physics Lab Report', course: 'Physics I', due: 'Friday', priority: 'medium' },
    { task: 'Literature Essay Draft', course: 'English Literature', due: 'Next Week', priority: 'low' },
    { task: 'CS Coding Assignment', course: 'Computer Science', due: 'Monday', priority: 'high' }
  ];

  const recentAchievements = [
    { title: 'Quiz Master', description: 'Scored 95% on Physics Quiz', icon: Star },
    { title: 'Fast Learner', description: 'Completed 5 lessons this week', icon: Zap },
    { title: 'Discussion Star', description: 'Top contributor in Literature', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              <h1 className="text-xl font-bold text-indigo-600">
                EduLMS <span className="text-sm font-normal text-gray-500">Student Portal</span>
              </h1>
            </div>

            {/* Center - Search Bar */}
            <div className="flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search courses, assignments, resources..."
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
                      <h3 className="text-lg font-semibold text-gray-900">Learning Updates</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Star className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">New grade posted</p>
                            <p className="text-xs text-gray-500">You scored 95% on Physics Quiz!</p>
                            <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-b hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Assignment due soon</p>
                            <p className="text-xs text-gray-500">Math Problem Set 4 due tomorrow</p>
                            <p className="text-xs text-gray-400 mt-1">1 day left</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t">
                      <Link 
                        href="/announcements" 
                        className="text-sm text-indigo-600 hover:text-indigo-800"
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
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
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
                      <div className="text-xs text-indigo-600 mt-1">Student</div>
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
            <h2 className="text-lg font-semibold">Learning Hub</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="mt-5 px-2 space-y-1">
            {studentSidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'bg-indigo-50 border-r-2 border-indigo-500 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-l-md`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={`${
                      item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
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
                Welcome back, {user.fullName.split(' ')[0]}! 🎓
              </h1>
              <p className="text-gray-600 mt-2">
                Keep up the great work! Here's your learning progress today.
              </p>
            </div>

            {/* Learning Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {learningStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="bg-white/70 backdrop-blur-sm">
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
              {/* Courses & Progress */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>My Courses</CardTitle>
                        <CardDescription>Track your learning progress across all subjects</CardDescription>
                      </div>
                      <Link href="/courses">
                        <Button size="sm" variant="outline">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="bg-white p-4 rounded-lg border">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{course.name}</h3>
                              <p className="text-sm text-gray-500">with {course.instructor}</p>
                            </div>
                            <div className="text-right">
                              <Badge 
                                variant={course.grade.startsWith('A') ? 'success' : 
                                        course.grade.startsWith('B') ? 'info' : 'outline'}
                              >
                                {course.grade}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-600 h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                            <div>
                              <p className="text-gray-600">Next: <span className="font-medium">{course.nextLesson}</span></p>
                              {course.dueAssignment && (
                                <p className="text-red-600">⚠️ {course.dueAssignment}</p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Link href={`/courses/${course.id}`}>
                                <Button size="sm" variant="outline">
                                  <Play className="h-4 w-4 mr-1" />
                                  Continue
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Achievements */}
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Recent Achievements</CardTitle>
                    <CardDescription>Your learning milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recentAchievements.map((achievement, index) => {
                        const Icon = achievement.icon;
                        return (
                          <div key={index} className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Icon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Upcoming Tasks */}
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Upcoming Tasks</CardTitle>
                    <CardDescription>Stay on top of your assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingTasks.map((task, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{task.task}</p>
                            <p className="text-xs text-gray-500">{task.course}</p>
                            <p className="text-xs text-gray-400">Due {task.due}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/assignments" className="block mt-4">
                      <Button size="sm" variant="outline" className="w-full">
                        View All Assignments
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Study Goals */}
                <Card className="bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Study Goals</CardTitle>
                    <CardDescription>Your weekly learning targets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Study Hours</span>
                          <span className="font-medium">8/10h</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Assignments</span>
                          <span className="font-medium">3/4</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-sm mb-1">
                          <span className="text-gray-600">Quiz Practice</span>
                          <span className="font-medium">2/2</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
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
