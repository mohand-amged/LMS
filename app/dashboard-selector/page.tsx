'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Award,
  BarChart3,
  FileText,
  Bell,
  Trophy,
  Clock,
  Target
} from 'lucide-react';

export default function DashboardSelector() {
  const router = useRouter();

  const teacherFeatures = [
    { icon: Users, title: "Student Management", desc: "Monitor and track all your students" },
    { icon: BookOpen, title: "Course Creation", desc: "Build and manage your courses" },
    { icon: FileText, title: "Assignment System", desc: "Create and grade assignments" },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Track class performance and engagement" },
    { icon: Award, title: "Grading Tools", desc: "Efficient grading and feedback system" },
    { icon: Bell, title: "Class Communication", desc: "Send announcements and updates" }
  ];

  const studentFeatures = [
    { icon: BookOpen, title: "My Courses", desc: "Access all your enrolled courses" },
    { icon: Target, title: "Learning Progress", desc: "Track your academic progress" },
    { icon: FileText, title: "Assignments", desc: "Submit and track your assignments" },
    { icon: Trophy, title: "Achievements", desc: "Earn badges and view accomplishments" },
    { icon: Award, title: "Grades & Feedback", desc: "View grades and teacher feedback" },
    { icon: Clock, title: "Study Planner", desc: "Manage deadlines and study schedule" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎓 Educational Dashboard System
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our completely separate dashboard interfaces designed specifically for teachers and students. 
              Each role gets a tailored experience with features built just for them.
            </p>
          </div>
        </div>
      </header>

      {/* Dashboard Options */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Teacher Dashboard */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-300">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Teacher Dashboard</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Comprehensive tools for educators to manage courses, track student progress, and deliver exceptional learning experiences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teacherFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50">
                      <Icon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        <p className="text-gray-600 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => router.push('/teacher-dashboard')}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg font-semibold"
                >
                  🏫 Access Teacher Dashboard
                </Button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Full teaching suite with student management and analytics
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Student Dashboard */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-2 hover:border-indigo-300">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Student Dashboard</CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Personalized learning environment where students can access courses, track progress, and achieve their academic goals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {studentFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-indigo-50">
                      <Icon className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        <p className="text-gray-600 text-xs">{feature.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => router.push('/student-dashboard')}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 text-lg font-semibold"
                >
                  🎓 Access Student Dashboard
                </Button>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Personalized learning experience with progress tracking
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Differences Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                🔄 Completely Separate Dashboard Experiences
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 max-w-4xl mx-auto">
                Unlike traditional systems with shared interfaces, our dashboards are entirely separate applications 
                tailored to each user role's specific needs and workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-600 flex items-center">
                    <GraduationCap className="h-6 w-6 mr-2" />
                    Teacher-Focused Features
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Complete student management and monitoring system
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Advanced analytics and class performance insights
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Course creation and content management tools
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Assignment creation and grading workflows
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Leaderboard configuration and management
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-indigo-600 flex items-center">
                    <BookOpen className="h-6 w-6 mr-2" />
                    Student-Centered Design
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                      Intuitive course navigation and learning paths
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                      Personal progress tracking and achievement system
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                      Assignment submission and deadline management
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                      Grade viewing and performance analytics
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                      Gamified learning with badges and rewards
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => router.push('/')}
            variant="outline" 
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Login
          </Button>
        </div>
      </main>
    </div>
  );
}
