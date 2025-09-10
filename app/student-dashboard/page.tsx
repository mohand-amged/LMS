'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  BookOpen, Award, Calendar, Clock, Play, Download, 
  CheckCircle, AlertTriangle, Star, Target, Trophy,
  MessageSquare, Bell, Settings, LogOut, Search,
  BarChart3, Activity, FileText, User, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { UserRole } from '../types';

// Student-specific interfaces
interface StudentStats {
  enrolledCourses: number;
  completedAssignments: number;
  averageGrade: number;
  studyHours: number;
  upcomingDeadlines: number;
  achievementsBadges: number;
}

interface EnrolledCourse {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  grade: string;
  nextLesson: string;
  dueAssignment: string | null;
  color: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: number;
  maxPoints: number;
  priority: 'high' | 'medium' | 'low';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  type: 'academic' | 'participation' | 'milestone';
}

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [studentStats, setStudentStats] = useState<StudentStats>({
    enrolledCourses: 6,
    completedAssignments: 24,
    averageGrade: 87.5,
    studyHours: 42,
    upcomingDeadlines: 3,
    achievementsBadges: 8
  });

  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([
    {
      id: '1',
      name: 'Advanced Mathematics',
      instructor: 'Prof. John Smith',
      progress: 78,
      grade: 'A-',
      nextLesson: 'Calculus Integration',
      dueAssignment: 'Problem Set 4 - Due Tomorrow',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: '2',
      name: 'Physics I',
      instructor: 'Dr. Sarah Johnson',
      progress: 65,
      grade: 'B+',
      nextLesson: 'Newton\'s Laws',
      dueAssignment: 'Lab Report - Due Friday',
      color: 'from-green-500 to-green-600'
    },
    {
      id: '3',
      name: 'English Literature',
      instructor: 'Ms. Emily Davis',
      progress: 92,
      grade: 'A',
      nextLesson: 'Shakespeare Analysis',
      dueAssignment: null,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: '4',
      name: 'Computer Science',
      instructor: 'Dr. Michael Brown',
      progress: 45,
      grade: 'B',
      nextLesson: 'Data Structures',
      dueAssignment: 'Coding Assignment - Due Monday',
      color: 'from-orange-500 to-orange-600'
    }
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Math Problem Set 4',
      course: 'Advanced Mathematics',
      dueDate: 'Tomorrow',
      status: 'pending',
      maxPoints: 100,
      priority: 'high'
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      course: 'Physics I',
      dueDate: 'Friday',
      status: 'pending',
      maxPoints: 50,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Literature Essay Draft',
      course: 'English Literature',
      dueDate: 'Next Week',
      status: 'submitted',
      grade: 85,
      maxPoints: 100,
      priority: 'low'
    },
    {
      id: '4',
      title: 'CS Coding Assignment',
      course: 'Computer Science',
      dueDate: 'Monday',
      status: 'pending',
      maxPoints: 75,
      priority: 'high'
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Quiz Master',
      description: 'Scored 95% or higher on 5 consecutive quizzes',
      icon: '🏆',
      earnedDate: '2 days ago',
      type: 'academic'
    },
    {
      id: '2',
      title: 'Early Bird',
      description: 'Submitted 10 assignments before the deadline',
      icon: '⏰',
      earnedDate: '1 week ago',
      type: 'participation'
    },
    {
      id: '3',
      title: 'Discussion Champion',
      description: 'Top contributor in class discussions this month',
      icon: '💬',
      earnedDate: '3 days ago',
      type: 'participation'
    }
  ]);

  useEffect(() => {
    if (!user || user.role !== UserRole.STUDENT) {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== UserRole.STUDENT) {
    return null;
  }

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'graded':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAchievementTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-blue-100 text-blue-800';
      case 'participation':
        return 'bg-green-100 text-green-800';
      case 'milestone':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Student Dashboard Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🎓 Student Dashboard
              </h1>
              <p className="text-gray-600">Hello {user.fullName}, ready to learn today?</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>2 New</span>
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
              { id: 'home', name: 'Home', icon: BarChart3 },
              { id: 'courses', name: 'My Courses', icon: BookOpen },
              { id: 'assignments', name: 'Assignments', icon: FileText },
              { id: 'grades', name: 'Grades', icon: Award },
              { id: 'achievements', name: 'Achievements', icon: Trophy },
              { id: 'progress', name: 'Progress', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {user.fullName.split(' ')[0]}!</h2>
                    <p className="text-indigo-100">You have 3 assignments due this week. Let's stay on track! 🚀</p>
                  </div>
                  <div className="text-6xl opacity-20">🎓</div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Enrolled Courses</p>
                      <p className="text-3xl font-bold">{studentStats.enrolledCourses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Completed Tasks</p>
                      <p className="text-3xl font-bold">{studentStats.completedAssignments}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm font-medium">Current Grade</p>
                      <p className="text-3xl font-bold">{studentStats.averageGrade}%</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Study Hours</p>
                      <p className="text-3xl font-bold">{studentStats.studyHours}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm font-medium">Due This Week</p>
                      <p className="text-3xl font-bold">{studentStats.upcomingDeadlines}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Achievements</p>
                      <p className="text-3xl font-bold">{studentStats.achievementsBadges}</p>
                    </div>
                    <Trophy className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrolledCourses.slice(0, 4).map((course) => (
                    <Card key={course.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className={`w-full h-2 bg-gradient-to-r ${course.color} rounded-full mb-4`}></div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{course.name}</h3>
                            <p className="text-sm text-gray-600">with {course.instructor}</p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-800">
                            {course.grade}
                          </Badge>
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
                        <div className="text-sm text-gray-600 mb-3">
                          <p>Next: <span className="font-medium">{course.nextLesson}</span></p>
                          {course.dueAssignment && (
                            <p className="text-red-600 mt-1">📝 {course.dueAssignment}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <Play className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>Stay on top of your assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignments.filter(a => a.status === 'pending').slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {getPriorityIcon(assignment.priority)}
                          <div>
                            <p className="font-medium text-gray-900">{assignment.title}</p>
                            <p className="text-sm text-gray-600">{assignment.course}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{assignment.dueDate}</p>
                          <Badge className={getAssignmentStatusColor(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Achievements</CardTitle>
                  <CardDescription>Your latest accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{achievement.title}</p>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getAchievementTypeColor(achievement.type)}>
                              {achievement.type}
                            </Badge>
                            <span className="text-xs text-gray-500">{achievement.earnedDate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-full h-3 bg-gradient-to-r ${course.color} rounded-full mb-4`}></div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                        <p className="text-gray-600">{course.instructor}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-800 text-lg px-3 py-1">
                        {course.grade}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600">Course Progress</span>
                        <span className="font-medium">{course.progress}% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-indigo-600 h-3 rounded-full transition-all" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Next lesson: </span>
                        <span className="font-medium text-gray-900">{course.nextLesson}</span>
                      </div>
                      {course.dueAssignment && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          📝 {course.dueAssignment}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Assignments</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Sort by Due Date</Button>
              </div>
            </div>

            {/* Assignment Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <span>Pending ({assignments.filter(a => a.status === 'pending').length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.filter(a => a.status === 'pending').map((assignment) => (
                      <div key={assignment.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                          {getPriorityIcon(assignment.priority)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-yellow-700">Due {assignment.dueDate}</span>
                          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600">
                            Start Work
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                    <span>Submitted ({assignments.filter(a => a.status === 'submitted').length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.filter(a => a.status === 'submitted').map((assignment) => (
                      <div key={assignment.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-medium text-gray-900 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                        <div className="flex justify-between items-center">
                          <Badge className="bg-blue-100 text-blue-800">Awaiting Grade</Badge>
                          <span className="text-sm text-gray-500">Submitted</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <span>Graded ({assignments.filter(a => a.status === 'graded').length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignments.filter(a => a.status === 'graded').map((assignment) => (
                      <div key={assignment.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-medium text-gray-900 mb-1">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
                        <div className="flex justify-between items-center">
                          <Badge className="bg-green-100 text-green-800">
                            {assignment.grade}/{assignment.maxPoints}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View Feedback
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Achievements</h2>
              <p className="text-gray-600">Celebrate your learning milestones and accomplishments!</p>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {achievements.filter(a => a.type === 'academic').length}
                  </div>
                  <div className="text-gray-600">Academic Achievements</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">🤝</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {achievements.filter(a => a.type === 'participation').length}
                  </div>
                  <div className="text-gray-600">Participation Badges</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-2">🎯</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {achievements.filter(a => a.type === 'milestone').length}
                  </div>
                  <div className="text-gray-600">Milestones Reached</div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{achievement.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 mb-4">{achievement.description}</p>
                    <div className="flex justify-center items-center space-x-2">
                      <Badge className={getAchievementTypeColor(achievement.type)}>
                        {achievement.type}
                      </Badge>
                      <span className="text-sm text-gray-500">{achievement.earnedDate}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
