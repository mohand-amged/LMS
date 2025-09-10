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

  // Mock student data
  const mockStudents = [
    {
      id: '1',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      username: 'sarah_j',
      avatar: '/avatars/sarah.jpg',
      role: 'STUDENT',
      grade: 'SECOND',
      enrolledCourses: ['Advanced Mathematics', 'Statistics'],
      averageGrade: 92.5,
      totalAssignments: 24,
      completedAssignments: 22,
      attendanceRate: 96,
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: '2',
      fullName: 'Michael Chen',
      email: 'michael.chen@email.com',
      username: 'mike_c',
      avatar: '/avatars/michael.jpg',
      role: 'STUDENT',
      grade: 'THIRD',
      enrolledCourses: ['Calculus I', 'Linear Algebra'],
      averageGrade: 88.3,
      totalAssignments: 18,
      completedAssignments: 16,
      attendanceRate: 92,
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      id: '3',
      fullName: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      username: 'emily_r',
      avatar: '/avatars/emily.jpg',
      role: 'STUDENT',
      grade: 'FIRST',
      enrolledCourses: ['Advanced Mathematics', 'Statistics', 'Calculus I'],
      averageGrade: 95.1,
      totalAssignments: 32,
      completedAssignments: 30,
      attendanceRate: 98,
      lastActive: '30 minutes ago',
      status: 'active'
    },
    {
      id: '4',
      fullName: 'David Kim',
      email: 'david.kim@email.com',
      username: 'david_k',
      avatar: '/avatars/david.jpg',
      role: 'STUDENT',
      grade: 'SECOND',
      enrolledCourses: ['Linear Algebra'],
      averageGrade: 78.9,
      totalAssignments: 12,
      completedAssignments: 9,
      attendanceRate: 84,
      lastActive: '3 days ago',
      status: 'at-risk'
    },
    {
      id: '5',
      fullName: 'Jessica Wang',
      email: 'jessica.wang@email.com',
      username: 'jessica_w',
      avatar: '/avatars/jessica.jpg',
      role: 'STUDENT',
      grade: 'THIRD',
      enrolledCourses: ['Advanced Mathematics', 'Calculus I'],
      averageGrade: 90.7,
      totalAssignments: 20,
      completedAssignments: 19,
      attendanceRate: 95,
      lastActive: '1 hour ago',
      status: 'active'
    },
    {
      id: '6',
      fullName: 'Alex Thompson',
      email: 'alex.thompson@email.com',
      username: 'alex_t',
      avatar: '/avatars/alex.jpg',
      role: 'STUDENT',
      grade: 'FIRST',
      enrolledCourses: ['Statistics'],
      averageGrade: 85.6,
      totalAssignments: 15,
      completedAssignments: 14,
      attendanceRate: 89,
      lastActive: '5 hours ago',
      status: 'active'
    }
  ];

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGrade, setFilterGrade] = useState('all');
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  const filteredStudents = mockStudents.filter(student => {
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    const matchesGrade = filterGrade === 'all' || student.grade === filterGrade;
    const matchesSearch = !searchQuery || 
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesGrade && matchesSearch;
  });

  const studentStats = [
    { title: 'Total Students', value: mockStudents.length.toString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
    { title: 'Active Students', value: mockStudents.filter(s => s.status === 'active').length.toString(), icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'At-Risk Students', value: mockStudents.filter(s => s.status === 'at-risk').length.toString(), icon: AlertCircle, color: 'bg-red-100 text-red-600' },
    { title: 'Average Grade', value: (mockStudents.reduce((acc, s) => acc + s.averageGrade, 0) / mockStudents.length).toFixed(1) + '%', icon: Star, color: 'bg-yellow-100 text-yellow-600' }
  ];

  const getGradeBadgeColor = (grade) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

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
                    placeholder="Search students by name or email..."
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
            {/* Student Management Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Student Management Dashboard 👨‍🎓
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all your students' progress, performance, and engagement.
              </p>
            </div>

            {/* Student Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {studentStats.map((stat, index) => {
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

            {/* Student Management Content */}
            <div className="space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search students by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="at-risk">At Risk</option>
                      </select>
                      <select
                        value={filterGrade}
                        onChange={(e) => setFilterGrade(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Grades</option>
                        <option value="FIRST">First Year</option>
                        <option value="SECOND">Second Year</option>
                        <option value="THIRD">Third Year</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Students List */}
              <div className="grid gap-6">
                {filteredStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
                              <Badge className={getStatusBadgeColor(student.status)}>
                                {student.status === 'active' ? 'Active' : 'At Risk'}
                              </Badge>
                            </div>
                            <p className="text-gray-600">{student.email}</p>
                            <p className="text-sm text-gray-500">@{student.username} • {student.grade} Year</p>
                            <p className="text-xs text-gray-400">Last active: {student.lastActive}</p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-2">
                          <Badge className={getGradeBadgeColor(student.averageGrade)}>
                            {student.averageGrade.toFixed(1)}% Average
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <p>{student.attendanceRate}% Attendance</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Enrolled Courses */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Enrolled Courses</h4>
                          <div className="space-y-1">
                            {student.enrolledCourses.map((course, index) => (
                              <div key={index} className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {course}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Assignment Progress */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Assignment Progress</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completed:</span>
                              <span className="font-medium">{student.completedAssignments}/{student.totalAssignments}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${(student.completedAssignments / student.totalAssignments) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round((student.completedAssignments / student.totalAssignments) * 100)}% Complete
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedStudent(student);
                              setShowStudentDetail(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredStudents.length === 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                      <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Student Detail Modal */}
      {showStudentDetail && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.fullName}</h2>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getStatusBadgeColor(selectedStudent.status)}>
                        {selectedStudent.status === 'active' ? 'Active' : 'At Risk'}
                      </Badge>
                      <Badge className={getGradeBadgeColor(selectedStudent.averageGrade)}>
                        {selectedStudent.averageGrade.toFixed(1)}% Average
                      </Badge>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStudentDetail(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Student Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedStudent.attendanceRate}%</div>
                      <div className="text-sm text-gray-600">Attendance Rate</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedStudent.completedAssignments}/{selectedStudent.totalAssignments}</div>
                      <div className="text-sm text-gray-600">Assignments Done</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedStudent.enrolledCourses.length}</div>
                      <div className="text-sm text-gray-600">Enrolled Courses</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Full Name:</span>
                        <span className="font-medium">{selectedStudent.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Username:</span>
                        <span className="font-medium">@{selectedStudent.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedStudent.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Grade Level:</span>
                        <span className="font-medium">{selectedStudent.grade} Year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Active:</span>
                        <span className="font-medium">{selectedStudent.lastActive}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enrolled Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedStudent.enrolledCourses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">{course}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Award className="h-4 w-4 mr-2" />
                      View Grades
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Check Attendance
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Assignment History
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

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
